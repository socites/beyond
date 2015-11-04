var Channel = function (channels, exports, host) {
    "use strict";

    if (host.substr(0, 1) === '/')
        host = location.hostname + ':' + beyond.hosts.ports.ws + host;

    var callbacks = [];

    var channel;
    exports.channel = function (callback) {

        if (channel && channel.connected) {
            callback(channel);
            return;
        }

        callbacks.push(callback);

    };

    require(['libraries/beyond.js/static/vendor/socket.io'], function (io) {

        var query = channels.connectionQuery;
        var qstring = '';
        for (var variable in query) {
            if (qstring) qstring += '&';
            qstring += variable + '=' + query[variable];
        }

        channel = io.connect(host, {'query': qstring});
        channel.on('connect', function () {

            for (var i in callbacks) callbacks[i](channel);
            callbacks = [];

        });

        channel.on('error', function (error) {
            console.log('channel error on host', host, error);
        });

    });

};
