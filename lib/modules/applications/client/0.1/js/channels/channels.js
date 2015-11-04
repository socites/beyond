var Channels = function (exports) {
    "use strict";

    var events = new Events();

    var Channels = function () {

        this.bind = function (event, listener) {
            events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            events.unbind(event, listener);
        };

    };

    exports.channels = new Channels();

    Object.defineProperty(this, 'connectionQuery', {
        'get': function () {

            var query = {};
            events.trigger('connect:before', query);

            return query;

        }
    });

};
