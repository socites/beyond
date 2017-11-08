// socket connection handler
module.exports = function (container, runtime, context) {
    "use strict";

    let rpc = new (require('./rpc'))(container, runtime, context);

    var initiated = Date.now();
    var counter = 0;

    let active = 0;

    let socket = context.socket;
    if (!socket) {
        console.error('Socket not found on container: "' + container.name + '"');
        return;
    }
    socket.on('rpc', function (request, callback) {

        if (typeof request !== 'object') {
            console.warn('invalid rpc, request must be an object');
            return;
        }
        if (typeof callback !== 'function') {
            console.warn('invalid rpc request, callback must be a function');
            return;
        }

        counter++;
        var id = initiated + '.' + counter;
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
        co(function *() {

            try {

                let response = yield rpc.execute(request);
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
