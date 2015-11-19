var async = require('async');

require('colors');
module.exports = function (paths, name, config, libraries, presets, specs) {
    "use strict";

    if (!specs) specs = {};

    this.name = name;
    this.params = {};
    this.valid = false;

    let imports, css, overwrites;
    Object.defineProperty(this, 'imports', {
        'get': function () {
            return imports;
        }
    });
    Object.defineProperty(this, 'css', {
        'get': function () {
            return css;
        }
    });
    Object.defineProperty(this, 'overwrites', {
        'get': function () {
            return overwrites;
        }
    });

    this.initialise = async(function *(resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(name, paths.code, config);
            if (!config) {
                this.valid = false;
                resolve();
                return;
            }

            if (!config.path) this.dirname = config.dirname;
            else this.dirname = require('path').resolve(config.dirname, config.path);

        }
        else {

            if (!config.path) this.dirname = paths.code;
            else this.dirname = require('path').resolve(paths.code, config.path);

        }

        let languages = config.languages;
        if (!(languages instanceof Array)) languages = [];
        if (!languages.length) languages.push('en');
        this.languages = languages;

        if (typeof config.params === 'object') this.params = config.params;

        if (typeof config.version !== 'string') {

            console.error('invalid version configuration on application "'.red + (name).bold.red + '"'.red);
            resolve();
            this.valid = false;
            return;

        }
        this.version = config.version;

        // check if path exists
        let fs = require('fs');
        if (!fs.existsSync(this.dirname) || !fs.statSync(this.dirname).isDirectory()) {

            let message;
            message = 'application "'.red + (name).red.bold + '" specified an invalid path. '.red + '\n' +
                'path does not exists or it is not a folder: "'.red + (this.dirname).bold + '"'.red;
            console.log(message);

            this.valid = false;
            resolve();
            return;

        }

        // order of the modules of the main start script
        let start = config.start;
        if (!start) start = [];
        if (start && !(start instanceof Array)) {
            console.log('WARNING: start declaration of application "'.yellow + (name).yellow.bold + '" is invalid'.yellow);
            start = [];
        }
        Object.defineProperty(this, 'start', {
            'get': function () {
                return start;
            }
        });

        imports = new (require('./imports.js'))(this, libraries, presets, config.imports);
        overwrites = new (require('./overwrites'))(this, config.overwrites);
        yield overwrites.initialise();

        require('./static.js')(this, config.static);

        let plugins = config.plugins;
        this.plugins = {};
        if (typeof plugins === 'object') {
            for (let moduleID in plugins) {

                if (!(plugins[moduleID] instanceof Array)) continue;
                this.plugins[moduleID] = plugins[moduleID];

            }
        }

        css = new (require('./css'))(this, config.css);
        yield css.initialise();

        // create a web socket connection
        if (typeof config.connect === 'undefined') this.connect = true;
        else this.connect = !!config.connect;

        if (!specs.local) {

            this.build = new (require('./build'))(this, paths.build, config.build, specs);
            if (typeof this.build.valid !== 'undefined' && !this.build.valid) {

                this.valid = false;
                resolve();
                return;

            }

        }

        this.valid = true;
        resolve();

    }, this);

};
