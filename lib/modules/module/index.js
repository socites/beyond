module.exports = function (config, specs, runtime) {
    "use strict";

    let async = require('async');
    let error = require('./error.js')(this);

    Object.defineProperty(this, 'config', {
        'get': function () {
            return config;
        }
    });

    if (!specs) specs = {};
    Object.defineProperty(this, 'application', {
        'get': function () {
            return specs.application;
        }
    });

    Object.defineProperty(this, 'library', {
        'get': function () {
            return specs.library;
        }
    });

    Object.defineProperty(this, 'version', {
        'get': function () {
            return specs.version;
        }
    });

    let initialised;
    Object.defineProperty(this, 'initialised', {
        'get': function () {
            return initialised;
        }
    });

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    let path = (specs.path) ? specs.path : '.';
    Object.defineProperty(this, 'path', {
        'get': function () {
            return path;
        }
    });

    let types, extends_, start, static_, custom;
    Object.defineProperty(this, 'types', {
        'get': function () {
            return types;
        }
    });
    Object.defineProperty(this, 'extends', {
        'get': function () {
            return extends_;
        }
    });
    Object.defineProperty(this, 'start', {
        'get': function () {
            return start;
        }
    });
    Object.defineProperty(this, 'static', {
        'get': function () {
            return static_;
        }
    });
    Object.defineProperty(this, 'custom', {
        'get': function () {
            return custom;
        }
    });

    this.initialise = async(function* (resolve, reject) {

        if (initialised) {
            resolve();
            return;
        }
        initialised = true;

        if (typeof config === 'string') {

            config = yield require('./read.js')(config);
            if (!config) {
                reject(error('configuration file not found'));
                return;
            }

            if (specs.dirname) dirname = specs.dirname;
            else dirname = config.dirname;

        }
        else {

            if (!specs.dirname) {
                reject(error('invalid specification on module initialisation'));
                return;
            }

            dirname = specs.dirname;

        }

        if (!config) {
            reject(error('module configuration not defined'));
            return;
        }

        if (config.type && typeof config.type !== 'string') {
            reject(error('module type is invalid'));
        }
        if (config.type) {
            config[config.type] = config;
            delete config.type;
        }

        types = new (require('./types'))(this, config);
        extends_ = new (require('./extends'))(this, config.extends);
        start = require('./start')(this, config);

        if (config.static) {
            static_ = new (require('./static'))(this, config.static, specs);
        }
        if (config.custom) {
            custom = require('./custom')(this, config.custom);
        }

        resolve();

    }, this);


    let ID;
    if (specs.library) {
        ID = 'libraries/' + specs.library.name;
        if (path === '.') {
            ID += '/main';
        }
        else {
            ID += '/' + path;
        }
    }
    else ID = 'application/' + path;

    // required on windows
    ID = ID.replace(/\\/g, '/');

    Object.defineProperty(this, 'ID', {
        'get': function () {
            return ID;
        }
    });

    let server = new (require('./server'))(this, config.server, runtime);
    Object.defineProperty(this, 'server', {
        'get': function () {
            return server;
        }
    });

    this.execute = async(function* (resolve, reject, action, params, context) {

        let actions = yield server.initialise();
        if (!actions) {
            reject('action not defined');
            return;
        }

        // open RPC script and find the method for this action
        action = (action.substr(0, 1) === '/') ? action = action.substr(1) : action;
        action = action.split('/');

        let method = actions;
        if (typeof method !== 'object') {
            reject('an object was expected on action "' + action.join('/') + '".');
            return;
        }

        for (let property of action) {

            if (typeof method !== 'object') {
                method = undefined;
                break;
            }

            method = method[property];

        }

        if (typeof method !== 'function') {
            reject('action "' + action.join('/') + '" does not exist');
            return;
        }

        // execute the action
        let response = yield method(params, context);

        resolve(response);

    }, this);

};
