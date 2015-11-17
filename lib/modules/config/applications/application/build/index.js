require('colors');
module.exports = function (application, buildPath, config, specs) {
    "use strict";

    if (!config) {
        console.log('invalid build configuration on application "'.red + (application.name).red.bold + '"'.red);
        this.valid = false;
        return;
    }

    let path = config.path;
    if (!path) path = application.name;

    this.js = require('path').resolve(buildPath, 'applications/js', path);
    this.ws = require('path').resolve(buildPath, 'applications/ws', path, application.version);

    this.dirname = require('path').resolve(buildPath, path);

    this.hosts = require('./hosts.js')(application, config.hosts, specs);
    if (!this.hosts) this.valid = false;

};
