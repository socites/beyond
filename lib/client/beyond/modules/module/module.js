let Module = function (ID, events) {

    Object.defineProperty(this, 'ID', {'get': () => ID});

    let library;
    (function (ID) {

        ID = ID.split('/');
        if (ID[0] === 'libraries') {
            library = beyond.libraries.get(ID[1]);
        }

    })(ID);
    Object.defineProperty(this, 'library', {'get': () => library});

    let path = ID;
    if (library && path === library.path) {
        path = path + '/main';
    }

    path = path.split('/');
    if (library) {
        // Remove /libraries/library
        path.splice(0, 2);
    }
    else {
        // Remove /application
        path.splice(0, 1);
    }

    path = path.join('/');

    Object.defineProperty(this, 'path', {'get': () => path});

    let host;
    if (library) {
        host = beyond.hosts.libraries[library.name].js;
    }
    else {
        host = beyond.hosts.application.js;
    }
    host += path;
    Object.defineProperty(this, 'host', {'get': () => host});

    let plugins = new Plugins(this);
    Object.defineProperty(this, 'plugins', {'get': () => plugins});

    let texts = new Texts(this);
    Object.defineProperty(this, 'texts', {'get': () => texts});

    this.react = new ReactRegister(this, events);

    this.control = new Control(this);

    let dependencies = new Dependencies(this);
    this.dependencies = dependencies;

    this.Action = Action(this, events);

    this.invalidateCache = function (actionPath, params) {

        let request = new Request(this, actionPath, params);
        let cache = new Cache();

        return cache.invalidate(request);

    };

    this.execute = function () {

        let action = new this.Action(...arguments);
        action.execute();

        return action;

    };

    let styles = new ModuleStyles(this);
    Object.defineProperty(this, 'styles', {'get': () => styles});

    Object.defineProperty(this, 'css', {'get': () => styles});

    let templates = new ModuleTemplates(this);
    Object.defineProperty(this, 'templates', {'get': () => templates});

    this.render = (path, params) => templates.render(path, params);

    Object.defineProperty(this, 'custom', {
        'get': function () {

            if (!library) {
                return;
            }

            let custom = 'application/custom/' + library.name + '/' + this.path;
            return custom;

        }
    });

    Object.defineProperty(this, 'socket', {
        'get': async () => {
            if (this.library) {
                if (!library.socket) {
                    throw new Error(`Library "${library.name}" does not support server communication`);
                }
                return await library.socket;
            }
            else {
                return await beyond.socket;
            }
        }
    });

    let ready;
    Object.defineProperty(this, 'ready', {'get': () => !!ready});

    let callbacks = [];
    this.done = function (callback) {

        if (ready) {
            callback(dependencies.modules);
            return;
        }

        callbacks.push(callback);

    };

    this.dependencies.done(function () {

        ready = true;

        for (let i in callbacks) {
            callbacks[i](dependencies.modules);
        }
        callbacks = undefined;

    });

};
