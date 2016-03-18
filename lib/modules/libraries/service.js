var async = require('async');

module.exports = function (library, config, runtime, context) {
    "use strict";

    let code;
    Object.defineProperty(library, 'code', {
        'get': function () {
            return code;
        }
    });

    let specs;
    Object.defineProperty(library, 'config', {
        'get': function () {
            return specs;
        }
    });

    Object.defineProperty(this, 'path', {
        'get': function () {
            if (code) return config.path;
        }
    });

    this.initialise = async(function *(resolve, reject) {

        if (!config) {
            resolve();
            return;
        }

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

        try {

            let Code;
            if (config.path) {

                Code = require(config.path);
                code = new Code(runtime, specs, context);
                if (typeof code.initialise !== 'undefined') yield code.initialise();

            }

        }
        catch (exc) {

            console.log('error running service on library "'.red + (library.name).red.bold + '"'.red);
            console.log(exc.stack);
            code = undefined;
            resolve();
            return;

        }

        resolve();

    });

};
