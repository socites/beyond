var Beyond = function (beyond) {
    "use strict";

    var events = new Events({'bind': this});

    if (!beyond) {
        console.error('invalid configuration, beyond variable is undefined');
        return;
    }

    if (!beyond.css) beyond.css = {};

    this.hosts = beyond.hosts;
    this.params = beyond.params;
    this.css = {'values': beyond.css.values};
    this.overwrites = beyond.overwrites;

    this.requireConfig = new RequireConfig(events);
    this.widgets = new Widgets();

    var channels = new Channels(this);

    this.libraries = new Libraries(this, channels);
    this.modules = new Modules(events);
    this.Module = Module;

    this.controls = new Controls(beyond.controls, events);

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

    exposeReady(this, events);

    this.start = function () {

        var appHost = this.hosts.application.ws;
        if (appHost) {
            Channel(channels, this, appHost);
        }

        events.trigger('start');
        delete this.start;

    };

};

if (typeof beyond !== 'object') {
    console.error('beyond configuration not set. Check if the script config.js is in your index.html and it must be before the beyond.js library.');
}
else {
    window.beyond = new Beyond(beyond);
}
