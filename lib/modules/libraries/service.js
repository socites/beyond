var async = require('async');

module.exports = async(function *(resolve, reject, library, config, runtime, context) {
    "use strict";

    let service;
    Object.defineProperty(library, 'service', {
        'get': function () {
            return service;
        }
    });

    if (!config) {
        resolve();
        return;
    }

    let specs;
    if (config.config) {

        let fs = require('fs');
        try {
            specs = fs.readFileSync(config.config, {'encoding': 'UTF8'});
            specs = JSON.parse(specs);
        }
        catch (exc) {

            let message = 'library service configuration file "'.red + (config.config).red.bold + '" is invalid'.red;
            console.log(message);
            console.log(exc.message);

            resolve();
            return;

        }

        if (typeof specs !== 'object') {

            let message = 'library service configuration file "'.red + (config.config).red.bold + '" is invalid'.red;
            console.log(message);

            resolve();
            return;

        }

    }

    Object.defineProperty(library, 'config', {
        'get': function () {
            return specs;
        }
    });

    try {

        let Service;
        if (config.path) {

            Service = require(config.path);
            service = new Service(runtime, specs, context);
            if (typeof service.initialise !== 'undefined') yield service.initialise();

        }

    }
    catch (exc) {

        console.log('error running service on library "'.red + (library.name).red.bold + '"'.red);
        console.log(exc.stack);
        service = undefined;
        resolve();
        return;

    }

    resolve();

});
