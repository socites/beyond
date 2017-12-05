module.exports = function (config, runtime) {
    "use strict";

    let async = require('async');

    Object.defineProperty(this, 'runtime', {
        'get': function () {
            return runtime;
        }
    });

    let modules;

    this.build = function (opts, languages) {

        // Avoid node to exit before build is complete
        process.stdin.resume();

        let co = require('co');
        co(function *() {

            try {

                if (!runtime) {
                    runtime = {};
                }

                runtime.local = false;
                runtime.build = opts;
                runtime = new (require('./runtime'))(runtime);

                config = new (require('./config'))(config, runtime);
                yield config.initialise();

                if (!config.valid) {
                    resolve();
                    return;
                }

                // Initialise types
                require('./types').initialise(config.types);

                modules = new (require('./modules'))(config, runtime);
                if (!modules) {
                    resolve();
                    return;
                }
                yield modules.initialise();

                let builder = require('./builder/index');

                let path = config.modules.paths.build;
                yield builder.build(path, modules, opts, runtime);

                process.stdin.pause();

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    };

};
