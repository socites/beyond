function exportSocket(exports, beyond, host) {

    if (beyond.params.local && host.startsWith('/')) {
        host = `${location.hostname}:${beyond.hosts.ports.ws}${host}`;
    }

    let promise;

    function initialise() {

        if (promise) return promise;
        promise = Promise.pending();

        function createSocket(io) {

            let query = beyond.sockets.getConnectionParams(host);
            let qstring = '';
            for (let variable in query) {
                if (qstring) qstring += '&';
                qstring += `${variable}=${query[variable]}`;
            }

            let socket = io.connect(host, {transports: ['websocket'], 'query': qstring});

            // On reconnection, reset the transports option, as the Websocket connection
            // may have failed (caused by proxy, firewall, browser, ...)
            socket.on('reconnect_attempt', () => socket.io.opts.transports = ['polling', 'websocket']);

            socket.on('error', error => console.error('Socket error:', error));
            socket.on('connect_error', error => console.error('Socket connection error:', error));
            socket.on('connect_timeout', error => console.error('Socket connection timeout:', error));

            promise.resolve(socket);

        }

        require(['socket.io'], function (io) {
            createSocket(io);
        });

        return promise;

    }


    Object.defineProperty(exports, 'socket', {'get': () => initialise()});

}
