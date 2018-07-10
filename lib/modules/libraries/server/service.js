module.exports = function (library, config, runtime) {
    'use strict';

    let code;
    Object.defineProperty(this, 'code', {
        'get': function () {
            return code;
        }
    });

    let specs;
    Object.defineProperty(this, 'specs', {
        'get': function () {
            return specs;
        }
    });

    Object.defineProperty(this, 'config', {
        'get': function () {
            return config;
        }
    });

    Object.defineProperty(this, 'path', {
        'get': function () {
            if (code) return config.path;
        }
    });

    this.initialise = function () {

        return new Promise(async function (resolve, reject) {

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

                    let message = `Library service configuration file "${config.config}" is invalid`.red;
                    console.log(message);
                    console.log(exc.message);

                    resolve();
                    return;

                }

                if (typeof specs !== 'object') {

                    let message = `Library service configuration file "${config.config}" is invalid`.red;
                    console.log(message);

                    resolve();
                    return;

                }

            }

            // Overwrite service configuration with the configuration applied in server configuration
            for (let property in config.serverConfig) {
                if (!config.serverConfig.hasOwnProperty(property)) continue;
                specs[property] = config.serverConfig[property];
            }

            try {

                let Code;
                if (config.path) {

                    Code = require(config.path);
                    code = new Code(runtime, specs);

                    if (typeof code.initialise === 'function') {
                        await code.initialise();
                    }

                }

            }
            catch (exc) {

                console.log(`Error running service on library "${library.name}"`.red);
                console.log(exc.stack);
                code = undefined;
                resolve();
                return;

            }

            resolve();

        });

    };

};
