require('colors');
module.exports = function (application, buildPath, config, specs) {
    "use strict";

    if (config && typeof config !== 'object') {
        console.log('Invalid build configuration on application "'.red + (application.name).red.bold + '".'.red);
        this.valid = false;
        return;
    }

    if (!config) config = {};

    Object.defineProperty(this, 'archive', {
        'get': function () {
            return config.archive;
        }
    });

    let path = config.path;
    if (!path) path = application.name;

    // Compilation properties for
    // modules, custom code and client (start.js & config.js) compile
    // Actually only property path is supported
    this.modules = {};
    this.custom = {};
    this.client = {};

    // config.libraries can be boolean or an object
    if (config.libraries) {

        this.libraries = new (require('./libraries.js'))(config.libraries);
        if (!this.libraries.valid) {
            delete this.libraries;
        }

    }

    // config.modules, config.custom and config.client actually supports only
    // the property "path" to specify the path where they have to be compiled
    // (ex: used by phonegap applications to compile the files inside the 'www' folder)
    if (typeof config.modules === 'object' && typeof config.modules.path === 'string') {
        this.modules.path = config.modules.path;
    }
    if (typeof config.custom === 'object' && typeof config.custom.path === 'string') {
        this.custom.path = config.custom.path;
    }
    if (typeof config.client === 'object' && typeof config.client.path === 'string') {
        this.client.path = config.client.path;
    }

    this.js = require('path').resolve(buildPath, 'applications/js', path);
    this.ws = require('path').resolve(buildPath, 'applications/ws', path, application.version);

    this.dirname = require('path').resolve(buildPath, path);

    this.hosts = require('./hosts.js')(application, config.hosts, specs);
    if (!this.hosts) this.valid = false;

};
