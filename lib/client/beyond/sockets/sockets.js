var Sockets = function () {
    "use strict";

    var events = new Events({'bind': this});

    /**
     * Triggers the connect:before event that can be extended by binding
     * to beyond.sockets.bind('connect:before', query, host)
     *
     * @param host {string} The host where the connection is going to be stablished
     * @returns {object} The connection query
     */
    this.getConnectionParams = function (host) {

        var query = {};
        events.trigger('connect:before', query, host);
        return query;

    };

};
