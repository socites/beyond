require('colors');

module.exports = function (application, dirname, config) {
    "use strict";

    let async = require('async');

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

    let statics = {};
    Object.defineProperty(this, 'static', {
        'get': function () {
            return statics;
        }
    });

    let initialised;
    this.initialise = async(function *(resolve, reject) {

        if (initialised) {
            resolve();
            return;
        }
        initialised = true;

        if (typeof config === 'string') {

            config = yield require('./read.js')(application, dirname, config);
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

                let message = 'Invalid custom configuration on application "'.yellow +
                    (application.name).yellow.bold + '".'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) this.dirname = application.dirname;
            else this.dirname = require('path').resolve(application.dirname, config.path);

        }
        delete config.dirname;

        let Module = require('./module');

        if (typeof config !== 'object') {
            return;
        }
        for (let moduleID in config) {

            let realID = moduleID;
            if (realID.substr(0, 1) === '/') {
                realID = realID.substr(1);
            }
            if (realID.substr(0, 10) !== 'libraries/') {
                realID = 'libraries/' + realID;
            }

            let module = new Module(application, this.dirname, realID, config[moduleID]);
            yield module.initialise();

            items[realID] = module;
            keys.push(realID);

        }

        // Build the list of static overwrites of all modules
        for (let moduleID of keys) {

            let module = items[moduleID];
            if (!module.static) continue;

            for (let resource of module.static.keys) {

                let path = require('url-join')(moduleID, resource);
                statics[path] = module.static.items[resource];

            }

        }

        resolve();

    }, this);

};
