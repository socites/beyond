var async = require('async');

require('colors');
module.exports = new (function () {
    "use strict";

    this.build = async(function *(resolve, reject, config, modules, specs) {

        if (!config.valid) return;

        if (!specs) specs = {};

        let languages = specs.languages;
        if (!languages) languages = ['eng', 'spa'];

        let buildPath = config.modules.paths.build;

        if (specs.libraries) {
            yield require('./libraries')(modules, languages, specs.libraries, buildPath);
        }

        if (specs.applications) {
            yield require('./applications')(modules, languages);
        }

        console.log('done');
        resolve();

    });

});
