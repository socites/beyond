function exportSocket(exports, beyond, host) {
    'use strict';

    if (beyond.params.local && host.substr(0, 1) === '/') {
        host = location.hostname + ':' + beyond.hosts.ports.ws + host;
    }

    let io, socket;

    let callbacks = [];
    exports.socket = function (callback) {

        if (socket) {
            callback(socket);
            return;
        }

        callbacks.push(callback);

    };

    function createSocket() {

        let query = beyond.sockets.getConnectionParams(host);
        let qstring = '';
        for (let variable in query) {
            if (qstring) qstring += '&';
            qstring += variable + '=' + query[variable];
        }

        socket = io.connect(host, {'query': qstring, 'reconnection': false});

        for (let i in callbacks) callbacks[i](socket);
        callbacks = [];

    }

    require(['socket.io'], function (_io) {
        io = _io;
        createSocket();
    });

}
