var async = require('async');

require('colors');
module.exports = function (paths, name, config, runtime) {
    "use strict";

    if (!runtime) runtime = {};

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
            console.log('Invalid configuration of library "' + (name).bold.red + '".'.red);
            console.log('\t', config);

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

                let message = 'Service directory "'.red + (service.path).bold.red +
                    '" specified on library "'.red + (this.name).bold.red + '" does not exist.'.red;
                console.log(message);

                this.valid = false;
                resolve();
                return;

            }

            // check that service configuration file exists
            if (service.config) {

                service.config = require('path').resolve(this.dirname, service.config);
                if (!fs.existsSync(service.config) || !fs.statSync(service.config).isFile()) {

                    let message = 'Service configuration file "'.red + (path).bold.red +
                        '" specified on library "'.red + (this.name).bold.red + '" does not exist.'.red;
                    console.log(message);

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

        let npm = config.npm;
        if (typeof npm === 'object' &&
            typeof npm.version === 'string' &&
            typeof npm.package === 'string') {

            this.npm = npm;
        }

        if (!runtime.local) {

            this.build = new (require('./build'))(this, paths.build, config.build, runtime);
            if (typeof this.build.valid !== 'undefined' && !this.build.valid) {
                this.valid = false;
                resolve();
                return;
            }

        }

        this.versions = new (require('./versions'))(paths, this, config.versions, runtime);

        this.valid = true;
        resolve();

    }, this)

};
