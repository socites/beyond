// socket connection handler
module.exports = function (socket, container, runtime, context) {
    "use strict";

    let rpc = new (require('./rpc'))(socket, container, runtime, context);

    socket.on('rpc', function (request, callback) {

        if (typeof request !== 'object') {
            console.warn('invalid rpc, request must be an object');
            return;
        }
        if (typeof callback !== 'function') {
            console.warn('invalid rpc request, callback must be a function');
            return;
        }

        let co = require('co');
        co(function *() {

            try {

                let response = yield rpc.execute(request);
                callback(response);

            }
            catch (exc) {

                if (exc instanceof Error) {

                    console.log(exc.stack);
                    callback({
                        'id': '__beyond__error__',
                        'error': {'message': exc.message}
                    });

                }
                else {

                    callback({
                        'id': '__beyond__error__',
                        'error': exc
                    });

                }

            }

        });

    });

};
