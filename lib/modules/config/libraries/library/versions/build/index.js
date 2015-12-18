var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
module.exports = function (version, library, config, specs) {
    "use strict";

    if (!config) {
        yaol.error(yaolMessenger,'invalid build configuration on library "'+library.name+'", version "'+version.version+'"');
        this.valid = false;
        return;
    }

    this.js = require('path').resolve(library.build.js, version.version);
    this.ws = require('path').resolve(library.build.ws, version.version);

    this.hosts = require('./hosts.js')(version, library, config.hosts, specs);
    if (!this.hosts) this.valid = false;

};
