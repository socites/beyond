require('colors');
module.exports = function (version, library, config, specs) {
    "use strict";

    if (!config) {
        console.log('invalid build configuration on library "'.red + (library.name).red.bold + '", version "'.red + (version.version).red.bold + '"'.red);
        this.valid = false;
        return;
    }

    this.js = require('path').resolve(library.build.js, version.version);
    this.ws = require('path').resolve(library.build.ws, version.version);

    this.hosts = require('./hosts.js')(version, library, config.hosts, specs);
    if (!this.hosts) this.valid = false;

};