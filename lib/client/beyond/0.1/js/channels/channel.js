var Channel = function (channels, exports, host, events) {
    "use strict";

    if (host.substr(0, 1) === '/')
        host = location.hostname + ':' + beyond.hosts.ports.ws + host;

    var callbacks = [];
    var io;

    var channel;
    exports.channel = function (callback) {

        if (channel && channel.connected) {
            callback(channel);
            return;
        }

        callbacks.push(callback);

    };

    function createChannel() {

        var query = channels.connectionQuery;
        var qstring = '';
        for (var variable in query) {
            if (qstring) qstring += '&';
            qstring += variable + '=' + query[variable];
        }

        channel = io.connect(host, {'query': qstring, 'reconnection': false});
        channel.on('connect', function () {

            events.trigger('channel.connect');
            for (var i in callbacks) callbacks[i](channel);
            callbacks = [];

        });

        channel.on('error', function (error) {
            console.log('Channel error on host: "' + host + '".', error);
            events.trigger('channel.error', error);
        });

        channel.on('disconnect', function () {
            channel.removeAllListeners();
            channel = undefined;
            events.trigger('channel.disconnect');
            createChannel();
        });

        channel.on('response', function (response) {
            events.trigger('response', response);
        });

        return channel;

    }

    require(['socket.io'], function (_io) {
        io = _io;
        createChannel();
    });

};
