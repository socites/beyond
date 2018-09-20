function exportSocket(exports, beyond, host) {

    if (beyond.params.local && host.startsWith('/')) {
        host = `${location.hostname}:${beyond.hosts.ports.ws}${host}`;
    }

    let socket;

    Object.defineProperty(exports, 'socket', {
        'get': () => new Promise(resolve => {

            if (socket) {
                resolve(socket);
                return;
            }

            function createSocket(io) {

                let query = beyond.sockets.getConnectionParams(host);
                let qstring = '';
                for (let variable in query) {
                    if (qstring) qstring += '&';
                    qstring += `${variable}=${query[variable]}`;
                }

                socket = io.connect(host, {'query': qstring});
                resolve(socket);

            }

            require(['socket.io'], function (io) {
                createSocket(io);
            });

        })
    });

}
