module.exports = function (application, root, moduleID, config) {
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

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    this.initialise = async(function* (resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(application, root, moduleID, config);
            if (!config) {
                resolve();
                return;
            }

            if (!config.path) {
                dirname = config.dirname;
            }
            else {
                dirname = require('path').resolve(config.dirname, config.path);
            }

        }
        else if (!config) {
            config = {};
        }
        else {

            if (typeof config !== 'object') {

                let message = 'Invalid custom configuration '.yellow +
                    'on application "'.yellow + (application.name).yellow.bold + '"'.yellow + ' ' +
                    'on module "'.yellow + (moduleID).yellow.bold + '".'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) {
                dirname = root;
            }
            else {
                dirname = require('path').resolve(root, config.path);
            }

        }
        delete config.dirname;

        for (let moduleID in config) {

            let extension = new (require('./extension'))(application, dirname, moduleID, config[moduleID]);
            yield extension.initialise();

            items[moduleID] = extension;
            keys.push(moduleID);

        }

        resolve();

    }, this);

};
