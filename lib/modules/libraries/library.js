var async = require('async');

require('colors');
module.exports = function (name, config, runtime) {
    "use strict";

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

    let context = {};
    Object.defineProperty(this, 'context', {
        'get': function () {
            return context;
        }
    });

    this.initialise = async(function *(resolve, reject) {

        yield require('./service.js')(this, config.service, runtime, context);
        resolve();

    }, this);

    this.rpc = function (ions) {

        let service = this.service;
        if (!service || typeof service.rpc !== 'function') return;

        try {

            service.rpc(ions);

        }
        catch (exc) {

            console.log('\n');
            console.log('service start error on library"'.red + (name).red.bold);
            console.log(exc.stack);

        }

    };

    this.connection = function (socket, context) {

        let service = this.service;
        if (!service || typeof service.connection !== 'function') return;
        try {

            service.connection(socket, context);

        }
        catch (exc) {

            console.log('\n');
            console.log('service connection error on library"'.red + (name).red.bold);
            console.log(exc.stack);

        }

    };

    this.versions = new (require('./versions'))(this, config.versions, runtime);
    this.connect = config.connect;
    this.build = config.build;

    this.valid = true;

};
