var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';

module.exports = new (function () {
    "use strict";

    this.build = async(function *(resolve, reject, config, modules, opts) {

        if (!config.valid) return;

        if (!opts) opts = {};

        let languages = opts.languages;
        if (!languages) languages = ['en'];

        if (opts.libraries) yield require('./libraries')(modules, languages, opts.libraries);
        if (opts.applications) yield require('./applications')(modules, languages);

        yaol.info(yaolMessenger,'done');
        resolve();

    });

});
