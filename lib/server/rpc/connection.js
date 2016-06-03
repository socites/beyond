// socket connection handler
module.exports = function (socket, container, runtime, context) {
    "use strict";

    let rpc = new (require('./rpc'))(socket, container, runtime, context);

    var initiated = Date.now();
    var counter = 0;

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

        let co = require('co');
        co(function *() {

            try {

                let response = yield rpc.execute(request);
                socket.emit('response', {'id': id, 'message': response});

            }
            catch (exc) {

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
