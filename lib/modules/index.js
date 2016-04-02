var async = require('async');

require('colors');
module.exports = function (config, runtime) {
    "use strict";

    let libraries, applications;
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return libraries;
        }
    });
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });

    this.initialise = async(function *(resolve, reject) {

        if (!runtime) runtime = new (require('../runtime'))({'local': true});

        if ((config instanceof require('../config'))) config = config.modules;
        else {
            config = new (require('./config'))(config, runtime);
            yield config.initialise();
        }

        // register the beyond.js client library
        let beyond = require('path').join(__dirname, 'applications/client/beyond/library.json');
        yield config.libraries.register('beyond', beyond);

        // register the vendor client library
        let vendor = require('path').join(__dirname, 'applications/client/vendor/library.json');
        yield config.libraries.register('vendor', vendor);

        libraries = new (require('./libraries'))(config.libraries, runtime);
        yield libraries.initialise();

        applications = new (require('./applications'))(libraries, config.applications, runtime);

        resolve();

    });

};
