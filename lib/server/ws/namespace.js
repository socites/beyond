module.exports = function (io, container, namespace, runtime) {

    io.of(namespace).on('connection', socket => {

        let context = new (require('./context.js'))(socket, io, namespace);

        try {
            container.connection(context);
        } catch (exc) {
            console.error(exc.stack);
        }

        require('./rpc')(container, runtime, context);

        socket.on('disconnect', function () {

            if (typeof container.disconnect !== 'function') {
                return;
            }

            try {
                container.disconnect(context);
            } catch (exc) {
                console.error(exc.stack);
            }

        });

    });

};
