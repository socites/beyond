require('colors');
module.exports = function (name, config, runtime) {
    "use strict";

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

    this.initialise = async(function* (resolve, reject) {

        service = new (require('./service.js'))(this, config.service, runtime);
        yield service.initialise();

        resolve();

    }, this);

    this.rpc = function (ions) {

        if (!service.code || typeof service.code.rpc !== 'function') {
            return;
        }

        try {
            service.code.rpc(ions);
        }
        catch (exc) {

            console.log('\n');
            console.log('service start error on library"'.red + (name).red.bold);
            console.log(exc.stack);

        }

    };

    this.connection = function (context) {

        if (!service.code || typeof service.code.connection !== 'function') {
            return;
        }

        try {
            service.code.connection(context);
        }
        catch (exc) {

            console.log('\n');
            console.log('service connection error on library"'.red + (name).red.bold);
            console.log(exc.stack);

        }

    };

    this.disconnect = function (context) {

        if (!service.code || typeof service.code.disconnect !== 'function') {
            return;
        }

        try {
            service.code.disconnect(context);
        }
        catch (exc) {

            console.log('\n');
            console.log('service disconnect error on library"'.red + (name).red.bold);
            console.log(exc.stack);

        }

    };

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
