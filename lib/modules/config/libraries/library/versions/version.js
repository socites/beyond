module.exports = function (paths, library, version, config, specs) {
    "use strict";

    Object.defineProperty(this, 'version', {
        'get': function () {
            return version;
        }
    });

    let path;
    if (typeof config.path !== 'string' || !config.path) path = './$version';
    else path = config.path;
    path = path.replace('$version', version);

    if (!specs.local) {

        this.build = new (require('./build'))(this, library, config.build, specs);
        if (typeof this.build.valid !== 'undefined' && !this.build.valid) {
            this.valid = false;
            return;
        }

    }

    this.start = config.start;

    this.dirname = require('path').resolve(library.dirname, path);

    if (typeof config.ws === 'string') this.ws = config.ws;

    // check if path exists
    let fs = require('fs');
    if (!fs.existsSync(this.dirname) || !fs.statSync(this.dirname).isDirectory()) {
        console.log('modules path "'.red + (this.dirname).red.bold + '" not found'.red);
        this.valid = false;
    }

    this.valid = true;

};
