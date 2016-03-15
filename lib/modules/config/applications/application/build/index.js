require('colors');
module.exports = function (application, buildPath, config, specs) {
    "use strict";

    if (typeof config !== 'object') {
        console.log('invalid build configuration on application "'.red + (application.name).red.bold + '"'.red);
        this.valid = false;
        return;
    }

    let path = config.path;
    if (!path) path = application.name;

    this.libraries = {};
    this.modules = {};
    this.custom = {};
    this.client = {};

    if (typeof config.libraries === 'object') this.libraries = config.libraries;
    if (typeof config.modules === 'object') this.modules = config.modules;
    if (typeof config.custom === 'object') this.custom = config.custom;
    if (typeof config.client === 'object') this.client = config.client;

    let internalPath = config.internalPath;
    if (typeof internalPath === 'string') {

        this.libraries.path = internalPath;
        this.modules.path = internalPath;
        this.custom.path = internalPath;
        this.client.path = internalPath;

    }

    this.js = require('path').resolve(buildPath, 'applications/js', path);
    this.ws = require('path').resolve(buildPath, 'applications/ws', path, application.version);

    this.dirname = require('path').resolve(buildPath, path);

    this.hosts = require('./hosts.js')(application, config.hosts, specs);
    if (!this.hosts) this.valid = false;

};
