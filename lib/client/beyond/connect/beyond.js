beyond.extend(function (beyond, events) {

    beyond.socket = async function (host, options) {

        options = (options) ? options : {};

        if (beyond.params.local && host.substr(0, 1) === '/') {
            host = `${location.hostname}:${beyond.hosts.ports.ws}${host}`;
        }

        let mods = await beyond.require({'socket.io': 'io'});

        /**
         * Triggers the event 'connect:before' to get the connection parameters
         * bind to this event: beyond.bind('connect:before', query, host)
         */
        let query = {};
        events.trigger('connect:before', query, host);

        options.query = '';
        for (let variable in query) {

            if (!query.hasOwnProperty(variable)) continue;

            options.query += (options.query) ? '&' : '';
            options.query += `${variable}=${query[variable]}`;

        }

        // Returns the socket
        return mods.io.connect(host, options);

    };

});
