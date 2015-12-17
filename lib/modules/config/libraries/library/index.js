var async = require('async');
var output = require('../../../../config/output');

module.exports = function (paths, name, config, specs) {
    "use strict";

    if (!specs) specs = {};

    this.name = name;

    this.initialise = async(function *(resolve, reject) {

        if (typeof config === 'string') {

            config = yield require('./read.js')(name, paths.code, config);
            if (!config) return;

            if (!config.path) config.path = './';
            this.dirname = require('path').resolve(config.dirname, config.path);

        }
        else {

            if (!config.path) config.path = './';
            this.dirname = require('path').resolve(paths.code, config.path);

        }

        if (typeof config !== 'object') {
            
            output.error('invalid configuration of library "'+name+'" \n\t\t'+config);
            
            this.valid = false;
            return;
        }

        // create a web socket connection
        if (typeof config.connect === 'undefined') this.connect = true;
        else this.connect = !!config.connect;

        let service;
        if (typeof config.service === 'string') service = {'path': config.service};
        else if (typeof config.service === 'object') service = config.service;

        if (service) {

            let fs = require('fs');

            // check that service directory exists
            service.path = require('path').resolve(this.dirname, service.path);
            if (!fs.existsSync(service.path) || !fs.statSync(service.path).isDirectory()) {

                output.error('service directory "'+service.path+'" specified on library "'+this.name+'" does not exist'),

                this.valid = false;
                resolve();
                return;

            }

            // check that service configuration file exists
            if (service.config) {

                service.config = require('path').resolve(this.dirname, service.config);
                if (!fs.existsSync(service.config) || !fs.statSync(service.config).isFile()) {

                    output.error('service configuration file "'+path+'" specified on library "'+this.name+'" does not exist');

                    this.valid = false;
                    resolve();
                    return;

                }

            }

            this.service = {
                'path': service.path,
                'config': service.config
            };

        }

        // not related with the modules client library, beyond.js use standalone = false
        this.standalone = config.standalone;

        if (!specs.local) {

            this.build = new (require('./build'))(this, paths.build, config.build, specs);
            if (typeof this.build.valid !== 'undefined' && !this.build.valid) {
                this.valid = false;
                resolve();
                return;
            }

        }

        this.versions = new (require('./versions'))(paths, this, config.versions, specs);

        this.valid = true;
        resolve();

    }, this)

};
