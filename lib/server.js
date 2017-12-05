module.exports = function (config, runtime) {
    "use strict";

    let async = require('async');

    Object.defineProperty(this, 'runtime', {
        'get': function () {
            return runtime;
        }
    });

    let modules;

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

        // Initialise types
        require('./types').initialise(config.types);

        modules = new (require('./modules'))(config, runtime);
        yield modules.initialise();

        resolve();

    });

    let server;
    this.start = function () {

        let co = require('co');
        co(function *() {

            try {

                yield initialise();
                if (!modules) return;

                server = require('./server/index');
                server.start(config, modules, runtime);

            }
            catch (exc) {
                console.log(exc.stack);
            }

        });

    };

};
