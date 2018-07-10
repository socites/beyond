require('colors');
module.exports = function (paths, name, config, servicesConfig, runtime) {
    'use strict';

    let async = require('async');

    if (!runtime) runtime = {};

    Object.defineProperty(this, 'name', {
        'get': function () {
            return name;
        }
    });

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    let valid, connect, service, npm, versions;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return !!valid;
        }
    });
    Object.defineProperty(this, 'connect', {
        'get': function () {
            return connect;
        }
    });
    Object.defineProperty(this, 'service', {
        'get': function () {
            return service;
        }
    });
    Object.defineProperty(this, 'npm', {
        'get': function () {
            return npm;
        }
    });
    Object.defineProperty(this, 'versions', {
        'get': function () {
            return versions;
        }
    });


    this.initialise = async(function* (resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(name, paths.code, config);
            if (!config) return;

            if (!config.path) config.path = './';
            dirname = require('path').resolve(config.dirname, config.path);

        }
        else {

            if (!config.path) config.path = './';
            dirname = require('path').resolve(paths.code, config.path);

        }

        if (typeof config !== 'object') {
            console.log('Invalid configuration of library "' + (name).bold.red + '".'.red);
            console.log('\t', config);

            valid = false;
            resolve();
            return;
        }

        // create a web socket connection
        connect = (typeof config.connect === 'undefined') ? true : !!config.connect;

        try {
            service = require('./service')(this, config.service, servicesConfig);
        } catch (exc) {

            valid = false;
            console.error(exc.message);
            resolve();
            return;

        }

        npm = new (require('./npm'))(this, config.npm, runtime);
        yield npm.initialise();
        npm = (npm.valid) ? npm : undefined;

        versions = new (require('./versions'))(paths, this, config.versions, runtime);

        valid = true;
        resolve();

    }, this)

};
