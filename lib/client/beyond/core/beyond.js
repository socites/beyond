let Beyond = function (config) {

    if (typeof config !== 'object') {
        console.error('Beyond configuration not set or is invalid');
        return;
    }

    config.hosts = (config.hosts) ? config.hosts : {};
    config.hosts.libraries = (config.hosts.libraries) ? config.hosts.libraries : {};

    // Expose the configuration settings
    Object.defineProperty(this, 'config', {'get': () => config});
    Object.defineProperty(this, 'hosts', {'get': () => config.hosts});
    Object.defineProperty(this, 'params', {'get': () => config.params});

    let events = new Events({'bind': this});

    let dispatcher = new Events();
    this.register = function (event, listener, priority) {
        return dispatcher.bind(event, listener, priority);
    };
    this.unregister = function (event, listener) {
        return dispatcher.unbind(event, listener);
    };
    this.dispatch = function () {
        return dispatcher.trigger.apply(dispatcher, arguments);
    };

    /**
     *
     * @param modules
     * @returns {Promise<any>}
     */
    this.require = function (modules) {

        let paths = [];
        for (let path in modules) {
            if (!modules.hasOwnProperty(path)) continue;
            paths.push(path);
        }

        return new Promise((resolve) => {

            require(paths, function () {

                let args = [...arguments];
                let output = {};
                paths.forEach((path, index) => {
                    output[modules[path]] = args[index];
                });

                resolve.call(output);

            });

        });

    };

    config.css = (config.css) ? config.css : {};
    let css = {'values': config.css.values};
    Object.defineProperty(this, 'css', {'get': () => css});

    let overwrites = config.overwrites;
    Object.defineProperty(this, 'overwrites', {'get': () => overwrites});

    let requireConfig = new RequireConfig(events);
    Object.defineProperty(this, 'requireConfig', {'get': () => requireConfig});

    let application = new Application(this);
    Object.defineProperty(this, 'application', {'get': () => application.proxy});

    let libraries = new Libraries(this);
    Object.defineProperty(this, 'libraries', {'get': () => libraries});

    let modules = new Modules(events);
    Object.defineProperty(this, 'modules', {'get': () => modules});

    let Module = Module;
    Object.defineProperty(this, 'Module', {'get': () => Module});

    let logs = new Logs(this);
    Object.defineProperty(this, 'logs', {'get': () => logs});

    // beyond.toasts works together with the ui/toast module
    let toast = new Toast(this);
    Object.defineProperty(this, 'toast', {'get': () => toast});

    exposeReady(this, events);

    this.extend = function (extension) {

        if (typeof extension !== 'function') {
            console.error('Invalid extension parameter', extension);
            throw new Error('Invalid extension');
        }

        extension(this, events, Dependencies);

    };

    this.start = function () {

        if (!$('body > .app-container').length) {
            console.error('body > .app-container does not exist');
        }

        events.trigger('start');
        delete this.start;

    };

};

if (typeof beyond !== 'object') {
    console.error('beyond configuration not set. ' +
        'Check if the script config.js is in your index.html and it must be before the beyond.js library.');
}
else {
    window.beyond = new Beyond(beyond);
}
