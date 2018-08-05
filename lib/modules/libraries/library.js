require('colors');
module.exports = function (name, config, runtime) {
    'use strict';

    let async = require('async');

    let valid;
    Object.defineProperty(this, 'valid', {'get': () => !!valid});
    Object.defineProperty(this, 'name', {'get': () => name});
    Object.defineProperty(this, 'dirname', {'get': () => config.dirname});
    Object.defineProperty(this, 'standalone', {'get': () => config.standalone});

    let service;
    Object.defineProperty(this, 'service', {'get': () => service});

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
    Object.defineProperty(this, 'versions', {'get': () => versions});

    Object.defineProperty(this, 'connect', {'get': () => config.connect});
    Object.defineProperty(this, 'build', {'get': () => config.build});
    Object.defineProperty(this, 'npm', {'get': () => config.npm});

    valid = true;

};
