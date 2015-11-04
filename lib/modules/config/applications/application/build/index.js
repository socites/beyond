require('colors');
module.exports = function (application, buildPath, config, specs) {
    "use strict";

    if (!config) {
        console.log('invalid build configuration on application "'.red + (application.name).red.bold + '"'.red);
        this.valid = false;
        return;
    }

    let path = config.path;
    if (!path) {
        console.log('invalid path on application "'.red + (application.name).red.bold + '"'.red);
        this.valid = false;

        return;
    }
    this.dirname = require('path').resolve(buildPath, path);

    this.hosts = require('./hosts.js')(application, config.hosts, specs);
    if (!this.hosts) this.valid = false;

};
