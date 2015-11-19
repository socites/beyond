var async = require('async');

require('colors');
module.exports = new (function () {
    "use strict";

    this.build = async(function *(resolve, reject, config, modules, opts) {

        if (!config.valid) return;

        if (!opts) opts = {};

        let languages = opts.languages;
        if (!languages) languages = ['en'];

        if (opts.libraries) yield require('./libraries')(modules, languages, opts.libraries);
        if (opts.applications) yield require('./applications')(modules, languages);

        console.log('done');
        resolve();

    });

});
