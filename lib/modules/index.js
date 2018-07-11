module.exports = function (config, runtime) {
    'use strict';

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

    this.initialise = async function () {

        if (!runtime) runtime = new (require('../runtime'))({'local': true});

        if ((config instanceof require('../config'))) config = config.modules;
        else {
            config = new (require('./config'))(config, runtime);
            await config.initialise();
        }

        // register the beyond.js client library
        let beyond = require('path').join(__dirname, '../client/beyond/library.json');
        await config.libraries.register('beyond', beyond);

        // register the vendor client library
        let vendor = require('path').join(__dirname, '../client/vendor/library.json');
        await config.libraries.register('vendor', vendor);

        // register ui helpers library
        let ui = require('path').join(__dirname, '../client/ui/library.json');
        await config.libraries.register('ui', ui);

        libraries = new (require('./libraries'))(config.libraries, runtime, config.services);
        await libraries.initialise();

        applications = new (require('./applications'))(libraries, config.applications, runtime);

    };

};
