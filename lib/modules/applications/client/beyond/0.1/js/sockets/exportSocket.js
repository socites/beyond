function exportSocket(exports, beyond, host) {
    "use strict";

    if (beyond.params.local && host.substr(0, 1) === '/') {
        host = location.hostname + ':' + beyond.hosts.ports.ws + host;
    }

    var io, socket;

    var callbacks = [];
    exports.socket = function (callback) {

        if (socket) {
            callback(socket);
            return;
        }

        callbacks.push(callback);

    };

    function createSocket() {

        var query = beyond.sockets.getConnectionParams(host);
        var qstring = '';
        for (var variable in query) {
            if (qstring) qstring += '&';
            qstring += variable + '=' + query[variable];
        }

        socket = io.connect(host, {'query': qstring, 'reconnection': false});

        for (var i in callbacks) callbacks[i](socket);
        callbacks = [];

    }

    require(['socket.io'], function (_io) {
        io = _io;
        createSocket();
    });

}
