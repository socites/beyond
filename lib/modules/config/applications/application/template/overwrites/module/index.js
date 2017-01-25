module.exports = function (application, root, moduleID, config) {
    "use strict";

    let async = require('async');

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    let custom;
    Object.defineProperty(this, 'custom', {
        'get': function () {
            return custom;
        }
    });

    let start;
    Object.defineProperty(this, 'start', {
        'get': function () {
            return start;
        }
    });

    let statics;
    Object.defineProperty(this, 'static', {
        'get': function () {
            return statics;
        }
    });

    let extensions;
    Object.defineProperty(this, 'extensions', {
        'get': function () {
            return extensions;
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

            config = yield require('./read.js')(application, root, moduleID, config);
            if (!config) {
                resolve();
                return;
            }

            if (!config.path) dirname = config.dirname;
            else dirname = require('path').resolve(config.dirname, config.path);

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

            if (!config.path) dirname = root;
            else dirname = require('path').resolve(root, config.path);

        }
        delete config.dirname;

        let Overwrites = require('./overwrites');
        if (config.custom) {
            custom = new Overwrites(config.custom);
        }
        if (config.start) {
            start = new Overwrites(config.start);
        }

        let Static = require('./static');
        if (config.static) {
            statics = new Static(application, moduleID, config.static);
        }

        let Extensions = require('./extensions');
        if (config.extensions) {

            extensions = new Extensions(
                application,
                dirname,
                moduleID,
                config.extensions);

            yield extensions.initialise();

        }

        resolve();

    }, this);

};
