require('colors');
module.exports = function (application, buildPath, config, specs) {
    "use strict";

    if (config && typeof config !== 'object') {
        console.log('Invalid build configuration on application "'.red + (application.name).red.bold + '".'.red);
        this.valid = false;
        return;
    }

    if (!config) config = {};

    let path = config.path;
    if (!path) path = application.name;

    this.modules = {};
    this.custom = {};
    this.client = {};

    // config.libraries can be boolean or an object
    if (config.libraries) this.libraries = config.libraries;

    // config.modules, config.custom and config.client can only be an object
    // it is used to specify its path (ex: used by phonegap applications to compile
    // the files inside the 'www' folder)
    if (typeof config.modules === 'object') this.modules = config.modules;
    if (typeof config.custom === 'object') this.custom = config.custom;
    if (typeof config.client === 'object') this.client = config.client;

    let internalPath = config.internalPath;
    if (typeof internalPath === 'string') {

        if (this.libraries) {
            if (typeof this.libraries !== 'object') this.libraries = {};
            this.libraries.path = internalPath;
        }
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
