let initiated = Date.now();
let counter = 0;
let active = 0;

module.exports = function (container, runtime, context) {

    let execute = require('./execute.js')(container, runtime, context);

    context.socket.on('rpc', function (request, callback) {

        let socket = context.socket;

        if (typeof request !== 'object') {
            console.warn('Invalid rpc, request must be an object');
            return;
        }
        if (typeof callback !== 'function') {
            console.warn('Invalid rpc request, callback must be a function');
            return;
        }

        counter++;
        let id = initiated + '.' + counter;
        callback(id);

        if (active > 30) {
            socket.emit('response', {
                'id': id,
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
                socket.emit('response', {'id': id, 'message': response});

            }
            catch (exc) {

                active--;
                if (exc instanceof Error) {

                    console.log(exc.stack);
                    socket.emit('response', {
                        'id': id,
                        'error': exc.message
                    });

                }
                else {

                    socket.emit('response', {
                        'id': id,
                        'error': exc
                    });

                }

            }

        });

    });

};
