require('colors');
module.exports = function (paths, name, config, servicesConfig, runtime) {
    "use strict";

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
            return;
        }

        // create a web socket connection
        connect = (typeof config.connect === 'undefined') ? true : !!config.connect;

        if (typeof config.service === 'string') {
            service = {'path': config.service};
        }
        else if (typeof config.service === 'object') {
            service = config.service;
        }

        if (service) {

            let fs = require('fs');

            // check that service directory exists
            service.path = require('path').resolve(dirname, service.path);
            if (!fs.existsSync(service.path) || !fs.statSync(service.path).isDirectory()) {

                let message = 'Service directory "'.red + (service.path).bold.red +
                    '" specified on library "'.red + (name).bold.red + '" does not exist.'.red;
                console.log(message);

                valid = false;
                resolve();
                return;

            }

            // check that service configuration file exists
            if (service.config) {

                service.config = require('path').resolve(dirname, service.config);
                if (!fs.existsSync(service.config) || !fs.statSync(service.config).isFile()) {

                    let message = 'Service configuration file "'.red + (path).bold.red +
                        '" specified on library "'.red + (name).bold.red + '" does not exist.'.red;
                    console.log(message);

                    valid = false;
                    resolve();
                    return;

                }

            }

            // set the configuration of the service that is overwritten by server configuration
            let serverConfig = (typeof servicesConfig[name] === 'object') ? servicesConfig[name] : undefined;
            serverConfig = (serverConfig) ? JSON.parse(JSON.stringify(serverConfig)) : {};

            for (let property in servicesConfig.common) {

                if (serverConfig[property]) {
                    continue;
                }

                let value = servicesConfig.common[property];
                serverConfig[property] = JSON.parse(JSON.stringify(value));

            }

            service = {
                'path': service.path,
                'config': service.config,
                'serverConfig': serverConfig
            };

        }

        npm = new (require('./npm'))(this, config.npm, runtime);
        yield npm.initialise();
        npm = (npm.valid) ? npm : undefined;

        versions = new (require('./versions'))(paths, this, config.versions, runtime);

        valid = true;
        resolve();

    }, this)

};
