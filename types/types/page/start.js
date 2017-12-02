module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (typeof config !== 'object' ||
            (config.route && (typeof config.route !== 'string' || config.route.indexOf(' ') !== -1))) {

            reject(error('Invalid page route configuration'));
            return;

        }

        let dependencies = {};

        dependencies.code = (config.dependencies.code) ? config.dependencies.code : undefined;
        dependencies.code = (config.dependencies.require && !dependencies.code) ? config.dependencies.require : dependencies.code;
        dependencies.controls = (config.dependencies.controls) ? config.dependencies.controls : undefined;

        if (dependencies.code && typeof dependencies !== 'object') {
            reject(error('Invalid page dependencies (code dependencies must be an object)'));
            return;
        }

        if (dependencies.controls && !(dependencies.controls instanceof Array)) {
            reject(error('Invalid page dependencies (controls dependencies must be an array)'));
            return;
        }

        config.dependencies.require[module.ID + '/page'] = 'Page';

        let output = {
            'route': config.route,
            'dependencies': dependencies
        };

        resolve('beyond.pages.register(' +
            'module, ' +
            JSON.stringify(output) +
            ');');

    });

};
