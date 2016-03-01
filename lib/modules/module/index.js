var async = require('async');

module.exports = function (config, specs, runtime) {
    "use strict";

    let error = require('./error.js')(this);

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

    Object.defineProperty(this, 'localized', {
        'get': function () {
            return config.localized;
        }
    });

    Object.defineProperty(this, 'control', {
        'get': function () {
            let control = config.control;

            if (typeof control === 'string') return control;
            else if (typeof control === 'object') {

                let type = control.type;
                if (type !== 'surface') type = 'screen';

                let pathname = control.pathname;
                if (typeof pathname !== 'string' || !pathname) pathname = undefined;

                return {
                    'pathname': pathname,
                    'type': type
                };

            }
            else if (typeof control === 'boolean' && control) return true;

        }
    });

    let extend, statics;
    Object.defineProperty(this, 'extends', {
        'get': function () {
            return extend;
        }
    });
    Object.defineProperty(this, 'static', {
        'get': function () {
            return statics;
        }
    });

    Object.defineProperty(this, 'standalone', {
        'get': function () {
            if (config.standalone) return true;
            if (specs.standalone) return true;
            else if (specs.library) return specs.library.standalone;
        }
    });

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    if (specs.path) this.path = specs.path;
    else this.path = '.';

    this.initialise = async(function *(resolve, reject) {

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

        extend = new (require('./extends'))(this, config.extends);
        this.start = require('./start')(this, config);

        resolve();

        if (config.static) statics = new (require('./static'))(this, config.static, specs);

        if (config.code) this.code = require('./code.js')(this, config.code);
        if (config.custom) this.custom = require('./custom.js')(this, config.custom);
        if (config.polymer) this.polymer = require('./polymer.js')(this, config.polymer);

    }, this);


    let ID;
    if (specs.library) {
        ID = 'libraries/' + specs.library.name;
        if (this.path !== '.') ID += '/' + this.path;
    }
    else ID = 'application/' + this.path;

    Object.defineProperty(this, 'ID', {
        'get': function () {
            return ID;
        }
    });

    let server = new (require('./server.js'))(this, config.server, runtime);
    Object.defineProperty(this, 'server', {
        'get': function () {
            return server;
        }
    });

    this.execute = async(function *(resolve, reject, action, params, socket, context) {

        let actions = yield server.actions;
        if (!actions) {
            reject('actions server error or not defined');
            return;
        }

        // open RPC script and find the method for this action
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

        context = {
            'connection': context
        };
        if (this.library) context.library = this.library.context;

        // execute the action
        let response = yield method(params, socket, context);

        resolve(response);

    }, this);

};
