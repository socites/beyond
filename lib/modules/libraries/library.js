require('colors');
module.exports = function (name, config, runtime) {
    'use strict';

    let async = require('async');

    let valid;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return !!valid;
        }
    });

    Object.defineProperty(this, 'name', {
        'get': function () {
            return name;
        }
    });

    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return config.dirname;
        }
    });
    Object.defineProperty(this, 'standalone', {
        'get': function () {
            return config.standalone;
        }
    });

    let service;
    Object.defineProperty(this, 'service', {
        'get': function () {
            return service;
        }
    });

    let versions = new (require('./versions'))(this, config.versions, runtime);
    Object.defineProperty(this, 'versions', {
        'get': function () {
            return versions;
        }
    });

    let connect = config.connect;
    Object.defineProperty(this, 'connect', {
        'get': function () {
            return connect;
        }
    });

    let build = config.build;
    Object.defineProperty(this, 'build', {
        'get': function () {
            return build;
        }
    });

    Object.defineProperty(this, 'npm', {
        'get': function () {
            return config.npm;
        }
    });

    valid = true;

};
