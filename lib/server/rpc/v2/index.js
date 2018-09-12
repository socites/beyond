let counter = 0;
let active = 0;
let cache = new Map();

module.exports = function (container, runtime, context) {

    let execute = require('./execute.js')(container, runtime, context);

    context.socket.on('rpc-v2', function (request, callback) {

        let socket = context.socket;

        if (typeof request !== 'object') {
            console.warn('Invalid rpc, request must be an object');
            return;
        }
        if (typeof callback !== 'function') {
            console.warn('Invalid rpc request, callback must be a function');
            return;
        }
        if (!request.id) {
            console.warn('Action id not set');
            return;
        }

        counter++;
        callback();

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
