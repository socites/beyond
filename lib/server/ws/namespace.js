module.exports = function (io, container, namespace, runtime) {

    let ns = io.of(namespace).on('connection', socket => function () {

        let context = new (require('./context.js'))(socket, io, namespace);

        async function onConnection() {

            try {
                await container.connection(context);
            } catch (exc) {
                console.error(exc.stack);
            }

        }

        async function onDisconnect() {

            try {
                await container.disconnect(context);
            } catch (exc) {
                console.error(exc.stack);
            }

        }

        onConnection().catch(error => console.error(error));

        socket.on('disconnect', () => {
            onDisconnect().catch(error => console.error(error));
        });

        require('./rpc')(container, runtime, context);

    });

    container.listen(ns).catch(error => console.error(error));

};
