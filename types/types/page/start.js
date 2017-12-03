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

        if (!config.dependencies) {
            config.dependencies = {};
        }

        dependencies.require = (config.dependencies.code) ? config.dependencies.code : undefined;
        dependencies.require = (config.dependencies.require && !dependencies.require) ? config.dependencies.require : dependencies.require;
        dependencies.controls = (config.dependencies.controls) ? config.dependencies.controls : undefined;

        if (!dependencies.require) {
            dependencies.require = {};
        }

        if (dependencies.require && typeof dependencies.require !== 'object') {
            reject(error('Invalid page dependencies (code dependencies must be an object)'));
            return;
        }

        if (dependencies.controls && !(dependencies.controls instanceof Array)) {
            reject(error('Invalid page dependencies (controls dependencies must be an array)'));
            return;
        }

        dependencies.require[module.ID + '/page'] = 'Page';

        if (typeof config.template === 'string') {
            dependencies.require[config.template] = 'Template';
        }

        let output = {
            'route': config.route,
            'dependencies': dependencies
        };

        resolve('beyond.pages.register(' +
            'module, ' +
            JSON.stringify(output) +
            ');\n');

    });

};
