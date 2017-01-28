module.exports = function (config, runtime) {
    "use strict";

    let async = require('async');

    Object.defineProperty(this, 'runtime', {
        'get': function () {
            return runtime;
        }
    });

    let modules;

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
