var async = require('async');


module.exports = function (paths, config, specs) {
    "use strict";

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

        let library = new Library({'code': this.dirname, 'build': paths.build}, name, config, specs);
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

        for (let name in config) {
            yield register(name, config[name]);
        }

        resolve();

    });

};
