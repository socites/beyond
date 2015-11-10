var async = require('async');

module.exports = function (application, root, moduleID, config) {
    "use strict";

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

            if (!config.path) this.dirname = config.dirname;
            else this.dirname = require('path').resolve(config.dirname, config.path);

        }
        else if (!config) {
            config = {};
        }
        else {

            if (typeof config !== 'object') {

                let message = 'invalid custom configuration '.yellow +
                    'on application "'.yellow + (application.name).yellow.bold + '"'.yellow + ' ' +
                    'on module "'.yellow + (moduleID).yellow.bold + '"'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) this.dirname = application.dirname;
            else this.dirname = require('path').resolve(application.dirname, config.path);

        }
        delete config.dirname;


        let extensions;
        Object.defineProperty(this, 'extensions', {
            'get': function () {
                return extensions;
            }
        });

        let Overwrites = require('./overwrites.js');
        if (config.custom) this.custom = new Overwrites(config.custom);
        if (config.start) this.start = new Overwrites(config.start);

        let Static = require('./static');
        if (config.static) this.static = new Static(application, moduleID, config.static);

        let Extensions = require('./extensions');
        if (config.extensions) {

            extensions = new Extensions(
                application,
                this.dirname,
                moduleID,
                config.extensions);

            yield extensions.initialise();

        }

        resolve();

    }, this);

};
