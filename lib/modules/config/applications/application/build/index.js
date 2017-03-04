require('colors');
module.exports = function (application, buildPath, config, runtime) {
    "use strict";

    if (config && typeof config !== 'object') {
        console.log('Invalid build configuration on application "'.red + (application.name).red.bold + '".'.red);
        this.valid = false;
        return;
    }

    if (!config) config = {};

    let path = config.path;
    if (!path) path = application.name;

    this.js = require('path').resolve(buildPath, 'applications/js', path);
    this.ws = require('path').resolve(buildPath, 'applications/ws', path, application.version);

    this.dirname = require('path').resolve(buildPath, path);

    this.hosts = require('./hosts.js')(application, config.hosts, runtime);
    this.valid = !!this.hosts;

};
