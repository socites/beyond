require('colors');
module.exports = function (paths, name, config, servicesConfig, libraries, presets, runtime) {
    'use strict';

    let async = require('async');

    if (!runtime) runtime = {};

    Object.defineProperty(this, 'name', {
        'get': function () {
            return name;
        }
    });

    let params = {};
    Object.defineProperty(this, 'params', {
        'get': function () {
            return params;
        }
    });

    let valid;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return !!valid;
        }
    });

    let imports, template;
    Object.defineProperty(this, 'imports', {
        'get': function () {
            return imports;
        }
    });
    Object.defineProperty(this, 'template', {
        'get': function () {
            return template;
        }
    });

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    let languages;
    Object.defineProperty(this, 'languages', {
        'get': function () {
            return languages;
        }
    });

    let version;
    Object.defineProperty(this, 'version', {
        'get': function () {
            return version;
        }
    });

    let ws;
    Object.defineProperty(this, 'ws', {
        'get': function () {
            return ws;
        }
    });

    let service;
    Object.defineProperty(this, 'service', {
        'get': function () {
            return service;
        }
    });

    let plugins;
    Object.defineProperty(this, 'plugins', {
        'get': function () {
            return plugins;
        }
    });

    let connect;
    Object.defineProperty(this, 'connect', {
        'get': function () {
            return connect;
        }
    });

    let build;
    Object.defineProperty(this, 'build', {
        'get': function () {
            return build;
        }
    });

    this.initialise = async(function* (resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(name, paths.code, config);
            if (!config) {
                valid = false;
                resolve();
                return;
            }

            if (!config.path) dirname = config.dirname;
            else dirname = require('path').resolve(config.dirname, config.path);

        }
        else {

            if (!config.path) dirname = paths.code;
            else dirname = require('path').resolve(paths.code, config.path);

        }

        languages = config.languages;
        if (!(languages instanceof Array)) languages = [];
        if (!languages.length) languages.push('eng');

        if (typeof config.params === 'object') {

            let extend = require('util')._extend;

            let p = {};
            extend(p, config.params);
            extend(p, config.params[runtime.environment]);

            delete p.development;
            delete p.production;

            params = p;

        }

        if (typeof config.version !== 'string') {

            console.error('invalid version configuration on application "'.red + (name).bold.red + '"'.red);
            resolve();
            valid = false;
            resolve();
            return;

        }
        version = config.version;

        ws = (typeof config.ws === 'object') ? config.ws : {};

        // check if path exists
        let fs = require('fs');
        if (!fs.existsSync(dirname) || !fs.statSync(dirname).isDirectory()) {

            let message;
            message = 'Application "'.red + (name).red.bold + '" specified an invalid path. '.red + '\n' +
                'path does not exists or it is not a folder: "'.red + (dirname).bold + '".'.red;
            console.log(message);

            valid = false;
            resolve();
            return;

        }

        // order of the modules of the main start script
        let start = config.start;
        if (!start) start = [];
        if (start && !(start instanceof Array)) {
            console.log('WARNING: start declaration of application "'.yellow + (name).yellow.bold + '" is invalid.'.yellow);
            start = [];
        }
        Object.defineProperty(this, 'start', {
            'get': function () {
                return start;
            }
        });

        imports = new (require('./imports.js'))(this, libraries, presets, config.imports);

        template = new (require('./template'))(this, config.template);
        yield template.initialise();

        require('./static.js')(this, config.static);

        plugins = {};
        if (typeof plugins === 'object') {
            for (let moduleID in config.plugins) {

                if (!(config.plugins[moduleID] instanceof Array)) continue;
                plugins[moduleID] = config.plugins[moduleID];

            }
        }

        // create a web socket connection
        if (typeof config.connect === 'undefined') connect = true;
        else connect = !!config.connect;

        try {
            service = require('./service')(this, config.service, servicesConfig);
        } catch (exc) {

            valid = false;
            console.error(exc.message);
            resolve();
            return;

        }

        if (!runtime.local) {

            build = new (require('./build'))(this, paths.build, config.build, runtime);
            if (typeof build.valid !== 'undefined' && !build.valid) {

                valid = false;
                resolve();
                return;

            }

        }

        valid = true;
        resolve();

    }, this);

};
