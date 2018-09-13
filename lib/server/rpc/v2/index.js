module.exports = function (container, runtime, context) {

    let counter = 0;
    let active = 0;
    let cache = new (require('./cache'))(context.socket.id);

    let STATE = Object.freeze({
        'EXECUTING': 0,
        'EXECUTED': 1
    });

    let execute = require('./execute.js')(container, runtime, context);

    context.socket.on('rpc-v2', function (request) {

        let socket = context.socket;

        if (typeof request !== 'object') {
            console.warn('Invalid rpc, request must be an object');
            return;
        }
        if (!request.id) {
            console.warn('Action id not set');
            return;
        }

        if (cache.has(request.id)) {
            let cached = cache.get(request.id);
            if (cached.state === STATE.EXECUTED) {
                socket.emit(`response-v2-${request.id}`, {'message': cached.response});
            }
            return;
        }

        cache.insert(request.id, {
            'state': STATE.EXECUTING,
            'requestedTime': Date.now()
        });

        counter++;

        if (active > 30) {
            socket.emit(`response-v2-${request.id}`, {
                'error': 'Max number of active connections achieved'
            });
            return;
        }

        active++;

        let co = require('co');
        co(function* () {

            try {

                let response = yield execute(request);
                let cached = cache.get(request.id);

                cache.update(request.id, {
                    'state': STATE.EXECUTED,
                    'requestedTime': cached.requestedTime,
                    'responseTime': Date.now() - cached.requestedTime,
                    'response': response
                });

                active--;
                socket.emit(`response-v2-${request.id}`, {'message': response});

            }
            catch (exc) {

                active--;
                if (exc instanceof Error) {
                    console.log(exc.stack);
                    socket.emit(`response-v2-${request.id}`, {'error': exc.message});
                }
                else {
                    socket.emit(`response-v2-${request.id}`, {'error': exc});
                }

            }

        });

    });

};
