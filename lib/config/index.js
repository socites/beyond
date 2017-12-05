module.exports = function (config, runtime) {
    "use strict";

    let async = require('async');

    let modules;
    Object.defineProperty(this, 'modules', {
        'get': function () {
            return modules;
        }
    });

    let initialised;
    this.initialise = async(function *(resolve, reject) {

        if (initialised) {
            console.log('configuration already initialised'.red);
            resolve();
            return;
        }

        if (typeof config === 'string') {

            config = yield require('./read.js')(config);
            if (!config) {
                this.valid = false;
                resolve();
                return;
            }

            this.root = config.dirname;

        }
        else {
            this.root = process.cwd();
        }

        if (!config) config = {};

        if (config.types && !(config.types instanceof Array)) {
            console.warn('Invalid types configuration');
            config.types = undefined;
        }
        if (config.types) {
            this.types = config.types;
        }

        this.ports = new (require('./ports.js'))(config.ports);
        modules = new (require('../modules/config'))(this.root, config, runtime);
        yield modules.initialise();

        let languages = config.languages;
        if (!(languages instanceof Array)) languages = [];
        if (!languages.length) languages.push('eng', 'spa');
        this.languages = languages;

        if (typeof modules.valid === 'boolean' && !modules.valid) {
            this.valid = false;
            resolve();
            return;
        }

        this.valid = true;
        resolve();

    }, this);

};
