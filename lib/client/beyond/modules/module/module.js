let Module = function (id, events) {
    'use strict';

    let path = id.split('/');

    let library;
    library = (path[0] === 'libraries') ? beyond.libraries.get(path[1]) : undefined;

    path += (library && path === library.path) ? '/main' : '';

    // Remove /libraries/library or /application from path
    (library) ? path.splice(0, 2) : path.splice(0, 1);
    path = path.join('/');

    Object.defineProperty(this, 'ID', {
        'get': () => id
    });
    Object.defineProperty(this, 'id', {
        'get': () => id
    });
    Object.defineProperty(this, 'library', {
        'get': () => library
    });
    Object.defineProperty(this, 'path', {
        'get': () => path
    });

    let hosts = beyond.hosts;
    let host = (library) ? hosts.libraries[library.name].js : hosts.application.js;
    host += path;
    Object.defineProperty(this, 'host', {
        'get': () => host
    });

    let plugins = new Plugins(this);
    Object.defineProperty(this, 'plugins', {
        'get': () => plugins
    });

    let texts = new Texts(this);
    Object.defineProperty(this, 'texts', {
        'get': () => texts
    });

    let react = new ReactRegister(this, events);
    Object.defineProperty(this, 'react', {
        'get': () => react
    });

    let control = new Control(this);
    Object.defineProperty(this, 'control', {
        'get': () => control
    });

    let dependencies = new Dependencies(this);
    Object.defineProperty(this, 'dependencies', {
        'get': () => dependencies
    });

    let Action = Action(this, events);
    Object.defineProperty(this, 'Action', {
        'get': () => Action
    });

    this.invalidateCache = function (actionPath, params) {
        let request = new Request(this, actionPath, params);
        let cache = new Cache();

        return cache.invalidate(request);
    };

    this.execute = function () {

        let args = [].slice.call(arguments);

        // options must be after callback
        let actionPath, params, callback, options;

        for (let i in args) {

            let arg = args[i];
            switch (typeof arg) {
                case 'string':
                    actionPath = arg;
                    break;
                case 'function':
                    callback = arg;
                    break;
                case 'object':
                    if (callback) options = arg;
                    else params = arg;
            }

        }

        if (typeof params === 'function' && typeof callback === 'undefined') {
            callback = params;
            params = undefined;
        }

        let action = new Action(actionPath, params);
        action.onResponse = function (response) {
            if (callback) callback(response);
        };
        action.onError = function (error) {
            if (callback) callback(undefined, error);
        };
        action.execute();

    };

    let styles = new ModuleStyles(this);
    Object.defineProperty(this, 'styles', {
        'get': () => styles
    });
    Object.defineProperty(this, 'css', {
        'get': () => styles
    });

    let templates = new ModuleTemplates(this);
    Object.defineProperty(this, 'templates', {
        'get': () => templates
    });
    this.render = function (path, params) {
        return templates.render(path, params);
    };

    let custom = (library) ? `application/custom/${library.name}/${this.path}` : undefined;
    Object.defineProperty(this, 'custom', {
        'get': () => custom
    });

    this.socket = function (callback) {

        let module = this;

        return new Promise(function (resolve, reject) {

            if (module.id.substr(0, 10) === 'libraries/') {

                if (!library.socket) {
                    reject(`library "${library.name}" does not support server communication`);
                }
                library.socket(function (socket) {
                    if (callback) callback(socket);
                    resolve(socket);
                });

            }
            else {

                beyond.socket(function (socket) {
                    if (callback) callback(socket);
                    resolve(socket);
                });

            }

        });

    };

    let ready;
    Object.defineProperty(this, 'ready', {
        'get': () => !!ready
    });

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
