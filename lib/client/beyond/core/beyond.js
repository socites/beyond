let Beyond = function (config) {

    if (typeof config !== 'object') {
        console.error('Beyond configuration not set or is invalid');
        return;
    }

    // Expose the configuration settings
    Object.defineProperty(this, 'config', {'get': () => config});
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

    let hosts = new Hosts(config.hosts);
    Object.defineProperty(this, 'hosts', {'get': () => hosts});

    let amd = new AMDConfig(hosts, events);
    Object.defineProperty(this, 'amd', {'get': () => amd});

    let application = new Application(this);
    Object.defineProperty(this, 'application', {'get': () => application.proxy});

    let libraries = new Libraries(this);
    Object.defineProperty(this, 'libraries', {'get': () => libraries});

    let modules = new Modules(events);
    Object.defineProperty(this, 'modules', {'get': () => modules});

    let controls = new Controls();
    Object.defineProperty(this, 'controls', {'get': () => controls});

    this.require = (modules) => new Promise((resolve, reject) => {

        if (!modules) return Promise.resolve();

        let paths = [];
        for (let path in modules) {
            if (!modules.hasOwnProperty(path)) continue;
            paths.push(path);
        }

        if (!modules.length) return Promise.resolve();

        require(paths, function () {

            let args = [...arguments];
            let output = {};
            paths.forEach((path, index) => {
                output[modules[path]] = args[index];
            });

            resolve.call(output);

        }, reject);

    });

    let overwrites = config.overwrites;
    Object.defineProperty(this, 'overwrites', {'get': () => overwrites});

    let logs = new Logs(this);
    Object.defineProperty(this, 'logs', {'get': () => logs});

    // beyond.toasts works together with the ui/toast module
    let toast = new Toast(this);
    Object.defineProperty(this, 'toast', {'get': () => toast});

    Object.defineProperty(this, 'ready', {'get': async () => controls.ready()})

    this.extend = function (extension) {

        if (typeof extension !== 'function') {
            console.error('Invalid extension parameter', extension);
            throw new Error('Invalid extension');
        }

        extension(this, events, Dependencies);

    };

    if (!document.querySelector('body > .app-container')) {
        console.error('HTML element "body > .app-container" does not exist');
    }

};

if (typeof beyond !== 'object') {
    console.error('beyond configuration not set. ' +
        'Check if the script config.js is in your index.html and it must be before the beyond.js library.');
}
else {
    window.beyond = new Beyond(beyond);
}
