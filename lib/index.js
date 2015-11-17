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

    let initialised;
    let initialise = async(function *(resolve, reject) {

        if (initialised) {
            resolve();
            return;
        }

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

        if (!runtime) runtime = {'local': true};
        runtime = new (require('./runtime'))(runtime);

        let co = require('co');
        co(function *() {

            try {

                yield initialise();
                if (!modules) return;

                server = require('./server');
                server.start(config, modules);

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    };

    this.build = function (opts, languages) {

        if (!runtime) runtime = {'local': false};
        runtime = new (require('./runtime'))(runtime);

        // avoid node to exit before build is complete
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
