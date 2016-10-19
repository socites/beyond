function exportSocket(exports, beyond, host) {
    "use strict";

    var io, socket;

    var callbacks = [];
    exports.socket = function (callback) {

        if (socket) {
            callback(socket);
            return;
        }

        callbacks.push(callback);

    };

    function createChannel() {

        var query = beyond.sockets.getConnectionParams(host);
        var qstring = '';
        for (var variable in query) {
            if (qstring) qstring += '&';
            qstring += variable + '=' + query[variable];
        }

        socket = io.connect(host, {'query': qstring, 'reconnection': false});

        for (var i in callbacks) callbacks[i](channel);
        callbacks = [];

    }

    require(['socket.io'], function (_io) {
        io = _io;
        createChannel();
    });

}
