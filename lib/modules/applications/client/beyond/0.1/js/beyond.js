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

    exposeReady(this, events);

    this.pages = new Pages(events);
    this.navigation = new Navigation(this, this.pages, events);
    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return this.navigation.pathname;
        }
    });

    this.navigate = function () {
        this.navigation.navigate.apply(this.navigation, arguments);
    };

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
