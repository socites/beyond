var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
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

            yaol.error(yaolMessenger,'\n service start error on library"'+name);
            yaol.error(yaolMessenger,exc.stack);

        }

    };

    this.connection = function (socket, context) {

        let service = this.service;
        if (!service || typeof service.connection !== 'function') return;
        try {

            service.connection(socket, context);

        }
        catch (exc) {

            yaol.error(yaolMessenger,'\n service connection error on library"'+name);
            yaol.error(yaolMessenger,exc.stack);

        }

    };

    this.versions = new (require('./versions'))(this, config.versions, runtime);
    this.connect = config.connect;
    this.build = config.build;

    this.valid = true;

};
