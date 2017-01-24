require('colors');

module.exports = function (application, config) {
    "use strict";

    let async = require('async');

    config = (config) ? config : {};

    Object.defineProperty(this, 'application', {
        'get': function () {
            return config.application;
        }
    });

    Object.defineProperty(this, 'modules', {
        'get': function () {
            return config.modules;
        }
    });

    let overwrites;
    Object.defineProperty(this, 'overwrites', {
        'get': function () {
            return overwrites;
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

                let message = 'Invalid template configuration on application "'.yellow +
                    (application.name).yellow.bold + '".'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) this.dirname = application.dirname;
            else this.dirname = require('path').resolve(application.dirname, config.path);

        }
        delete config.dirname;

        overwrites = new (require('./overwrites'))(application, this.dirname, config.overwrites);
        yield overwrites.initialise();

        resolve();

    });

};
