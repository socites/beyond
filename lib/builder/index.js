require('colors');

module.exports = new (function () {
    "use strict";

    let async = require('async');

    this.build = async(function *(resolve, reject, config, modules, specs) {

        if (!config.valid) {
            console.log('Configuration is not valid'.red);
            resolve();
            return;
        }
        if (!specs) {
            console.log('Build configuration not specified'.red);
            resolve();
            return;
        }

        let path = config.modules.paths.build;

        if (specs.libraries) {
            yield require('./libraries')(modules, specs.libraries, path);
        }

        if (specs.applications) {
            yield require('./applications')(modules, specs.applications, path);
        }

        console.log('done');
        resolve();

    });

});
