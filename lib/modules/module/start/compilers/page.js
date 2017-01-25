module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (typeof config !== 'object' || typeof config.route !== 'string' || config.route.indexOf(' ') !== -1) {
            console.log('WARNING: invalid page configuration on module "' + module.ID + '"');
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

        config.dependencies.require[module.ID + '/page'] = 'Page';

        let output = {
            'route': config.route,
            'dependencies': config.dependencies
        };

        resolve('beyond.pages.register(' +
            'module, ' +
            JSON.stringify(output) +
            ');');

    });

};
