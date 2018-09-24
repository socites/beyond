function exportSocket(exports, beyond, host) {

    if (beyond.params.local && host.startsWith('/')) {
        host = `${location.hostname}:${beyond.hosts.ports.ws}${host}`;
    }

    let promise = Promise.pending();

    let initialised;

    function initialise() {

        if (initialised) return promise;
        initialised = true;

        function createSocket(io) {

            let query = beyond.sockets.getConnectionParams(host);
            let qstring = '';
            for (let variable in query) {
                if (qstring) qstring += '&';
                qstring += `${variable}=${query[variable]}`;
            }

            socket = io.connect(host, {'query': qstring});
            promise.resolve(socket);

        }

        require(['socket.io'], function (io) {
            createSocket(io);
        });

        return promise;

    }


    Object.defineProperty(exports, 'socket', {'get': () => initialise()});

}
