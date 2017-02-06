var Beyond = function (beyond) {
    "use strict";

    if (!beyond) {
        console.error('invalid configuration, beyond variable is undefined');
        return;
    }

    var events = new Events({'bind': this});

    var dispatcher = new Events();
    this.register = function (event, listener, priority) {
        return dispatcher.bind(event, listener, priority);
    };
    this.unregister = function (event, listener) {
        return dispatcher.unbind(event, listener);
    };
    this.dispatch = function () {
        return dispatcher.trigger.apply(dispatcher, arguments);
    };

    if (!beyond.css) beyond.css = {};

    this.hosts = beyond.hosts;
    this.params = beyond.params;
    this.css = {'values': beyond.css.values};
    this.overwrites = beyond.overwrites;

    this.requireConfig = new RequireConfig(events);

    this.sockets = new Sockets();

    this.libraries = new Libraries(this);
    this.modules = new Modules(events);
    this.Module = Module;

    this.logs = new Logs(this);

    // beyond.toasts works together with the ui/toast module
    this.toast = new Toast(this);

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

    this.registerError = function () {
        this.errorHandler.registerError.apply(this.errorHandler, arguments);
    };

    this.start = function () {

        var appHost = this.hosts.application.ws;
        if (appHost) {
            exportSocket(this, this, appHost);
        }

        if (!$('body > .app-container').length) {
            console.error('body > .app-container does not exist');
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
