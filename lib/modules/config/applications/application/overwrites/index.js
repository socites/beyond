var async = require('async');

require('colors');
module.exports = function (application, config) {
    "use strict";

    let items = {};
    let keys = [];
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

    this.initialise = async(function *(resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(application, config);
            if (!config) {
                resolve();
                return;
            }

            if (!config.path) this.dirname = config.dirname;
            else this.dirname = require('path').resolve(config.dirname, config.path);

        }
        else if (!config) {
            config = {};
        }
        else {

            if (typeof config !== 'object') {

                let message = 'invalid custom configuration on application "'.yellow +
                    (application.name).yellow.bold + '"'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) this.dirname = application.dirname;
            else this.dirname = require('path').resolve(application.dirname, config.path);

        }
        delete config.dirname;

        let Module = require('./module');

        if (typeof config !== 'object') return;
        for (let moduleID in config) {

            let module = new Module(application, this.dirname, moduleID, config[moduleID]);
            yield module.initialise();

            items[moduleID] = module;
            keys.push(moduleID);

        }

        resolve();

    }, this);

};
