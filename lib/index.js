var async = require('async');

module.exports = function (config, runtime) {
    "use strict";

    Object.defineProperty(this, 'runtime', {
        'get': function () {
            return runtime;
        }
    });

    let modules;
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return modules.libraries;
        }
    });
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return modules.applications;
        }
    });

    this.helpers = require('./helpers');

    let initialised;
    let initialise = async(function *(resolve, reject) {

        if (initialised) {
            resolve();
            return;
        }

        runtime = new (require('./runtime'))(runtime);

        config = new (require('./config'))(config, runtime);
        yield config.initialise();

        if (!config.valid) {
            resolve();
            return;
        }

        modules = new (require('./modules'))(config, runtime);
        yield modules.initialise();

        resolve();

    });

    this.initialise = initialise;

    let server;
    this.start = function () {

        let co = require('co');
        co(function *() {

            try {

                yield initialise();
                if (!modules) return;

                server = require('./server');
                server.start(config, modules, runtime);

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    };

    this.build = function (opts, languages) {

        if (typeof runtime !== 'object') runtime = {'local': false};
        if (typeof runtime.local !== 'boolean') runtime.local = false;

        // Avoid node to exit before build is complete
        process.stdin.resume();

        let co = require('co');
        co(function *() {

            try {

                yield initialise();
                if (!modules) return;

                let builder = require('./builder');
                yield builder.build(config, modules, opts);

                process.stdin.pause();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    };

};
