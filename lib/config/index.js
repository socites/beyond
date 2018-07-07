module.exports = function (config, runtime) {
    "use strict";

    let async = require('async');

    let modules;
    Object.defineProperty(this, 'modules', {
        'get': function () {
            return modules;
        }
    });

    let valid;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return !!valid;
        }
    });

    let root;
    Object.defineProperty(this, 'root', {
        'get': function () {
            return root;
        }
    });

    let types, ports, languages;
    Object.defineProperty(this, 'types', {
        'get': function () {
            return types;
        }
    });
    Object.defineProperty(this, 'ports', {
        'get': function () {
            return ports;
        }
    });
    Object.defineProperty(this, 'languages', {
        'get': function () {
            return languages;
        }
    });

    let initialised;
    this.initialise = async(function* (resolve, reject) {

        if (initialised) {
            console.log('configuration already initialised'.red);
            resolve();
            return;
        }

        if (typeof config === 'string') {

            config = yield require('./read.js')(config);
            if (!config) {
                valid = false;
                resolve();
                return;
            }

            root = config.dirname;

        }
        else {
            root = process.cwd();
        }

        if (!config) config = {};

        if (config.types && !(config.types instanceof Array)) {
            console.warn('Invalid types configuration');
            config.types = undefined;
        }
        if (config.types) {
            types = config.types;
        }

        ports = new (require('./ports.js'))(config.ports);
        modules = new (require('../modules/config'))(root, config, runtime);
        yield modules.initialise();

        let languages = config.languages;
        if (!(languages instanceof Array)) languages = [];
        if (!languages.length) languages.push('eng', 'spa');

        if (typeof modules.valid === 'boolean' && !modules.valid) {
            valid = false;
            resolve();
            return;
        }

        valid = true;
        resolve();

    }, this);

};
