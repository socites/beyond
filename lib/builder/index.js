var async = require('async');

require('colors');
module.exports = new (function () {
    "use strict";

    this.build = async(function *(resolve, reject, config, modules, opts) {

        if (!config.valid) return;

        if (!opts) opts = {};

        let languages = opts.languages;
        if (!languages) languages = ['en'];

        let buildPath = config.modules.paths.build;

        if (opts.libraries) yield require('./libraries')(modules, languages, opts.libraries, buildPath);
        if (opts.applications) yield require('./applications')(modules, languages);

        console.log('done');
        resolve();

    });

});
