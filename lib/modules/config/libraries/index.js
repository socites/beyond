require('colors');
module.exports = function (paths, config, servicesConfig, runtime) {
    "use strict";

    let async = require('async');

    let items = {}, keys = [];
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });

    Object.defineProperty(this, 'length', {
        'get': function () {
            return keys.length;
        }
    });

    let Library = require('./library');
    let register = async(function *(resolve, reject, name, config) {

        let library = new Library(
            {'code': this.dirname, 'build': paths.build},
            name, config, servicesConfig, runtime);

        yield library.initialise();
        if (!library.valid) return;

        keys.push(name);
        items[name] = library;

        resolve();

    });
    this.register = register;

    this.initialise = async(function *(resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(paths.code, config);
            if (!config) {
                resolve();
                return;
            }

            this.dirname = config.dirname;
            delete config.dirname;

        }
        else {

            this.dirname = paths.code;

        }

        if (config && (config.development || config.production)) {

            let environment = config[runtime.environment];
            environment = (typeof environment === 'object') ? environment : undefined;
            for (let lib in environment) {
                yield register(lib, environment[lib]);
            }

            delete config.development;
            delete config.production;

        }

        for (let name in config) {
            yield register(name, config[name]);
        }

        resolve();

    });

};
