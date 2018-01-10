module.exports = function (library, config, runtime) {
    "use strict";

    let exports = this;

    let async = require('async');
    this.initialise = async(function *(resolve, reject) {

        if (!config) {
            resolve();
            return;
        }
        else if (typeof config === 'string') {

            config = yield require('./read.js')(library, config);
            if (!config) {
                resolve();
                return;
            }

            this.dirname = config.dirname;

        }
        else if (typeof config !== 'object') {

            resolve();
            return;

        }

        if (typeof config !== 'object') {
            console.log('Invalid configuration of library "' + (name).bold.red + '".'.red);
            console.log('\t', config);
            resolve();
            return;
        }

        function exportProperties(layer, config) {

            if (!config.package || !config.version) {
                return;
            }

            exports[layer] = {};
            exports[layer].package = config.package;
            exports[layer].version = config.version;
            exports[layer].publish = config.publish;
            exports[layer].readme = config.readme;

        }

        function exportLayer(layer, config) {

            if (!config) {
                return;
            }

            if (config.development || config.production) {
                exportProperties(layer, config[runtime.environment]);
            }
            else {
                exportProperties(layer, config);
            }

        }

        exportLayer('client', config.client);
        exportLayer('server', config.server);

        exports.valid = !!exports.client || !!exports.server;
        resolve();

    });

};
