// RPC calls handler
module.exports = function (container, runtime, context) {
    'use strict';

    let execute = require('./execute')(container, runtime, context);

    let initiated = Date.now();
    let counter = 0;

    let active = 0;

    let socket = context.socket;
    if (!socket) {
        console.error('Socket not found on container: "' + container.name + '"');
        return;
    }
    socket.on('rpc', async function (request, callback) {

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
                'error': 'Max number of active requests achieved'
            });
            return;
        }

        active++;

        try {

            let response = await execute(request);
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

};
