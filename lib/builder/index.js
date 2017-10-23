require('colors');

module.exports = new (function () {
    "use strict";

    let async = require('async');

    this.build = async(function *(resolve, reject, path, modules, specs, runtime) {

        if (!specs) {
            console.log('Build configuration not specified'.red);
            resolve();
            return;
        }

        if (specs.libraries) {
            yield require('./libraries')(modules, specs.libraries, path);
        }

        if (specs.applications) {
            yield require('./applications')(modules, specs.applications, path, runtime);
        }

        console.log('done');
        resolve();

    });

});
