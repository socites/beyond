module.exports = function (application, root, moduleID, config) {
    "use strict";

    let async = require('async');

    let css, txt;
    Object.defineProperty(this, 'css', {
        'get': function () {
            return css;
        }
    });

    Object.defineProperty(this, 'txt', {
        'get': function () {
            return txt;
        }
    });

    this.initialise = async(function *(resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(application, root, moduleID, config);
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

                let message = 'Invalid custom configuration '.yellow +
                    'on application "'.yellow + (application.name).yellow.bold + '"'.yellow + ' ' +
                    'on module "'.yellow + (moduleID).yellow.bold + '".'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) this.dirname = application.dirname;
            else this.dirname = require('path').resolve(application.dirname, config.path);

        }
        delete config.dirname;

        if (typeof config.css === 'string') css = [config.css];
        else if (config.css instanceof Array) css = config.css;

        if (typeof config.txt === 'string') txt = [config.txt];
        else if (config.txt instanceof Array) txt = config.txt;

        resolve();

    }, this);

};
