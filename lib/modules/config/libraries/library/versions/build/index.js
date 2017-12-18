require('colors');
module.exports = function (version, library, config, runtime) {
    "use strict";

    if (config && typeof config !== 'object') {

        console.log('Invalid build configuration on library "'.red + (library.name).red.bold +
            '", version "'.red + (version.version).red.bold + '".'.red);

        this.valid = false;
        return;

    }

    if (!config) config = {};

    this.hosts = require('./hosts.js')(version, library, config.hosts, runtime);
    if (!this.hosts) this.valid = false;

};
