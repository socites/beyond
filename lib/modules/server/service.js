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

    this.initialise = async function () {

        if (!config) {
            return;
        }

        if (config.config) {

            let fs = require('fs');
            try {
                specs = fs.readFileSync(config.config, {'encoding': 'UTF8'});
                specs = JSON.parse(specs);
            }
            catch (exc) {
                throw `Library service configuration file "${config.config}" is invalid`;
            }

            if (typeof specs !== 'object') {
                throw  `Library service configuration file "${config.config}" is invalid`;
            }

        }

        // Overwrite service configuration with the configuration applied in server configuration
        for (let property in config.serverConfig) {
            if (!config.serverConfig.hasOwnProperty(property)) continue;
            specs[property] = config.serverConfig[property];
        }

        let Code;
        if (config.path) {

            Code = require(config.path);
            code = new Code(runtime, specs);

            if (typeof code.initialise === 'function') {
                await code.initialise();
            }

        }

    };

};
