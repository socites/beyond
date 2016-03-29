var async = require('async');

module.exports = function (module, config) {
    "use strict";

    return async(function *(resolve, reject, language, overwrites) {

        if (typeof config !== 'object' && typeof config !== 'string') {
            console.log('WARNING: invalid page configuration on module "' + module.ID + '"');
            resolve();
            return;
        }

        if (typeof config == 'string') {
            config = {'route': config};
        }

        if (config.route && (typeof config.route !== 'string' || config.route.indexOf(' ') !== -1)) {
            console.log('WARNING: invalid page route on module "' + module.ID + '"');
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
            console.log('WARNING: invalid page require dependencies (must be an object and not an array) on module "' + module.ID + '"');
            resolve();
            return;
        }

        if (config.dependencies.polymer && !(config.dependencies.polymer instanceof Array)) {
            console.log('WARNING: invalid page polymer dependencies (must be an array) on module "' + module.ID + '"');
            resolve();
            return;
        }

        config.dependencies.require[module.ID] = 'Page';

        resolve('beyond.pages.register(' +
            'module, ' +
            JSON.stringify(config) +
            ');');

    });

};
