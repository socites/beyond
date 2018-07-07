require('colors');
module.exports = function (paths, config, libraries, presets, runtime) {
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

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    this.initialise = async(function* (resolve) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(paths.code, config);
            if (!config) {
                resolve();
                return;
            }

            dirname = config.dirname;
            delete config.dirname;

        }
        else {

            dirname = paths.code;

        }

        let Application = require('./application');
        for (let name in config) {

            let application = new (Application)({
                'code': dirname,
                'build': paths.build
            }, name, config[name], libraries, presets, runtime);

            yield application.initialise();

            if (!application.valid) continue;

            keys.push(name);
            items[name] = application;

        }

        resolve();

    }, this);

};
