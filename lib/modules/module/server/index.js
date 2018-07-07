module.exports = function (module, config, runtime) {
    "use strict";

    config = (typeof config === 'string') ? config = {'actions': config} : config;

    Object.defineProperty(this, 'config', {
        'get': function () {
            return config;
        }
    });

    // The server configuration
    let specs = new (require('./config.js'))(module, config);

    let backend = new (require('./backend.js'))(module, config, runtime, specs);
    Object.defineProperty(this, 'backend', {
        'get': function () {
            return backend.value;
        }
    });

    let actions = new (require('./actions.js'))(module, config, runtime, specs, backend);
    Object.defineProperty(this, 'actions', {
        'get': function () {
            return actions.value;
        }
    });

    this.initialise = require('async')(function* (resolve) {
        resolve(yield actions.initialise());
    });

};
