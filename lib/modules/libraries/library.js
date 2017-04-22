require('colors');
module.exports = function (name, config, runtime) {
    "use strict";

    let async = require('async');

    this.valid = false;

    this.name = name;
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

    this.initialise = async(function *(resolve, reject) {

        service = new (require('./service.js'))(this, config.service, runtime);
        yield service.initialise();

        resolve();

    }, this);

    this.rpc = function (ions) {

        let service = this.service;
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

        let service = this.service;
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

        let service = this.service;
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

    this.versions = new (require('./versions'))(this, config.versions, runtime);
    this.connect = config.connect;
    this.build = config.build;

    this.valid = true;

    Object.defineProperty(this, 'npm', {
        'get': function () {
            return config.npm;
        }
    });

};
