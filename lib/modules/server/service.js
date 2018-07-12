module.exports = function (library, config, runtime) {
    'use strict';

    let path = (config) ? config.path : undefined;
    config = (config) ? config.config : undefined;

    let serverConfig = config.serverConfig;

    let code;
    Object.defineProperty(this, 'code', {
        'get': function () {
            return code;
        }
    });

    Object.defineProperty(this, 'path', {
        'get': function () {
            return path;
        }
    });

    this.initialise = async function () {

        if (!path) {
            return;
        }

        if (config) {

            let fs = require('fs');
            let file = config;

            try {
                config = fs.readFileSync(file, {'encoding': 'UTF8'});
                config = JSON.parse(config);
            }
            catch (exc) {
                throw new Error(`Library service configuration file "${file}" is invalid`);
            }

            if (typeof config !== 'object') {
                throw  new Error(`Library service configuration file "${config}" is invalid`);
            }

        }

        // Overwrite service configuration with the configuration applied in server configuration
        for (let property in serverConfig) {
            if (!serverConfig.hasOwnProperty(property)) continue;
            config[property] = serverConfig[property];
        }

        if (path) {

            try {

                code = new (require(path))(runtime, specs);
                if (typeof code.initialise === 'function') {
                    await code.initialise();
                }

            } catch (exc) {
                console.error(exc.stack);
                throw new Error('Error instancing and initialising service');
            }

        }

    };

};
