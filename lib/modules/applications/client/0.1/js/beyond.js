var Beyond = function (beyond) {
    "use strict";

    var events = new Events({'bind': this});

    this.hosts = beyond.hosts;
    this.params = beyond.params;
    this.css = {'values': beyond.css.values};
    this.overwrites = beyond.overwrites;

    this.loader = new Loader(events);

    var channels = new Channels(this);

    this.libraries = new Libraries(this, channels);
    this.modules = new Modules(events);
    this.Module = Module;

    this.routes = new Routes(beyond.routes);

    this.navigation = new Navigation(this);
    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return this.navigation.pathname;
        }
    });
    this.navigate = function () {
        this.navigation.navigate.apply(this.navigation, arguments);
    };

    var online;
    Object.defineProperty(this, 'online', {
        'get': function () {
            return online && socket.connected;
        }
    });
    events.bind('online', function () {
        online = true;
    });
    events.bind('offline', function () {
        online = false;
    });

    Object.defineProperty(this, 'connected', {
        'get': function () {
            return socket.connected;
        }
    });

    this.start = function () {

        Channel(channels, this, this.hosts.application.ws);

        events.trigger('start');
        delete this.start;

    };

};

window.beyond = new Beyond(beyond);
