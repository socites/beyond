/**
 * @param {string} [root] - The path where the libraries are stored
 * @param {object|string} config - The libraries configuration, or the path to the configuration file
 * @params {object} runtime - The runtime configuration (local, offline, environment, ...)
 */
require('colors');
module.exports = function () {
    "use strict";

    let root, config, runtime;
    let async = require('async');

    if (arguments.length === 3) {
        root = arguments[0];
        config = arguments[1];
        runtime = arguments[2];
    }
    else if (arguments.length === 2) {
        if (typeof arguments[0] === 'undefined') {
            root = process.cwd();
            config = {};
        }
        else if (typeof arguments[0] !== 'string')
            throw new Error('invalid arguments on modules configuration constructor');
        else config = arguments[0];

        runtime = arguments[1];
    }

    let Runtime = require('../../runtime');
    if (!(runtime instanceof Runtime)) runtime = new Runtime(runtime);

    let libraries, applications, presets;
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return libraries;
        }
    });
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });
    Object.defineProperty(this, 'presets', {
        'get': function () {
            return presets;
        }
    });

    // The services configuration is used to overwrite the configuration
    // of the services of the libraries, by instance, to configure the logs configuration
    let services;
    Object.defineProperty(this, 'services', {
        'get': function () {
            return services;
        }
    });

    var defaults = {};
    Object.defineProperty(this, 'defaults', {
        'get': function () {
            return defaults;
        }
    });

    this.initialise = async(function *(resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(root, config);
            if (!config) return;

            this.root = config.dirname;

        }
        else {
            this.root = root;
        }

        if (!runtime.local && !runtime.environment) {
            console.log('Invalid runtime specification.'.red);
            this.valid = false;
            resolve();
            return;
        }

        this.paths = new (require('./paths'))(this.root, config.paths, runtime);
        runtime.paths = this.paths;

        config.services = (typeof config.services === 'object') ? config.services : {};
        libraries = new (require('./libraries'))(this.paths, config.libraries, config.services, runtime);
        yield libraries.initialise();

        presets = new (require('./presets'))(config.presets, this.libraries);

        applications = new (require('./applications'))(this.paths, config.applications,
            this.libraries, this.presets, runtime);

        yield applications.initialise();

        if (typeof config.defaults === 'object') {

            let defaultApplication = config.defaults.application;
            if (typeof defaultApplication === 'string') {

                if (applications.keys.indexOf(defaultApplication) === -1) {
                    console.log('Invalid application default. Application '.yellow +
                        '"'.yellow + (defaultApplication).bold.yellow + '"'.yellow +
                        ' is not registered.'.yellow
                    );
                }
                else {
                    defaults.application = defaultApplication;
                }

            }

            let defaultLanguage = config.defaults.language;
            if (typeof defaultLanguage === 'string' && defaultLanguage.length === 3) {
                defaults.language = defaultLanguage;
            }

        }

        resolve();

    }, this);

};
