var async = require('async');

module.exports = function (module, config) {
    "use strict";

    let code = require('../../code/index');

    return async(function *(resolve, reject, language, overwrites) {

        if (typeof config !== 'object') {
            resolve();
            return;
        }

        if (typeof config.name !== 'string' || !config.name || config.name.indexOf(' ') !== -1) {
            console.log('WARNING: invalid widget name on module "' + module.ID + '"');
            resolve();
            return;
        }

        if (!config.dependencies) {
            config.dependencies = {};
        }

        if (!config.dependencies.require) {
            config.dependencies.require = {};
        }

        if (typeof config.dependencies.require !== 'object' || config.dependencies.require instanceof Array) {
            console.log('WARNING: invalid widget require dependencies (must be an object and not an array) on module "' + module.ID + '"');
            resolve();
            return;
        }

        if (config.dependencies.polymer && !(config.dependencies.polymer instanceof Array)) {
            console.log('WARNING: invalid widget polymer dependencies (must be an array) on module "' + module.ID + '"');
            resolve();
            return;
        }

        config.dependencies.require[module.ID] = 'Control';

        resolve('beyond.widgets.register(' +
            '"' + module.ID + '", ' +
            JSON.stringify(config) +
            ');');

    });

};
