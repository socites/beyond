module.exports = function (module, config, runtime) {
    "use strict";

    let async = require('async');

    let EMPTY = {};

    if (typeof config === 'string') config = {'actions': config};

    Object.defineProperty(this, 'config', {
        'get': function () {
            return config;
        }
    });

    let actions;
    Object.defineProperty(this, 'actions', {

        'get': async(function *(resolve, reject) {

            if (typeof config !== 'object') {
                resolve();
                return;
            }
            if (typeof config.actions !== 'string' || !config.actions) {
                resolve();
                return;
            }
            if (actions && actions === EMPTY) {
                resolve();
                return;
            }
            if (actions) {
                resolve(actions);
                return;
            }

            let path;
            path = require('path').resolve(module.dirname, config.actions);

            // check if path exists
            let fs = require('co-fs');
            if (!(yield (fs.exists(path))) || !(yield (fs.stat(path))).isDirectory()) {
                actions = EMPTY;
                console.log('actions server "' + path + '" configuration error'.red);
                resolve();
                return;
            }

            try {
                let Actions = require(path);
                actions = new Actions(runtime, yield this.specs, yield this.backend);
            }
            catch (exc) {
                actions = EMPTY;

                let message;
                if (exc instanceof Error) {
                    message = exc.stack;
                }
                else {
                    message = exc.message;
                }

                console.log('error on actions server "'.red + (path).bold.red + '": ' + (message).red);
                resolve();
                return;
            }

            resolve(actions);

        }, this)

    });

    let backend;
    Object.defineProperty(this, 'backend', {

        'get': async(function *(resolve, reject) {

            if (backend && backend === EMPTY) {
                resolve();
                return;
            }
            if (backend) {
                resolve(backend);
                return;
            }

            if (!config || typeof config !== 'object') {
                backend = EMPTY;
                resolve();
                return;
            }

            let server = config.backend;
            if (typeof server !== 'string') {
                backend = EMPTY;
                resolve();
                return;
            }

            let path = require('path').resolve(module.dirname, server);

            // check if path exists
            let fs = require('co-fs');
            if (!(yield (fs.exists(path))) || !(yield (fs.stat(path))).isDirectory()) {

                backend = EMPTY;
                console.log('backend server configuration not found on module "'.red + (module.ID).red.bold + '"'.red);
                resolve();
                return;

            }

            try {

                let Backend = require(path);
                if (typeof Backend !== 'function') {

                    console.log('Backend "' + path + '" does not expose a function.');
                    resolve();
                    return;

                }

                let specs = yield this.specs;
                backend = new Backend(runtime, specs);

            }
            catch (exc) {

                backend = EMPTY;
                console.log(exc.stack);
                resolve();
                return;

            }

            resolve(backend);

        }, this)

    });

    let specs;
    Object.defineProperty(this, 'specs', {
        'get': async(function *(resolve, reject) {

            if (specs && specs === EMPTY) {
                resolve();
                return;
            }
            if (specs) {
                resolve(specs);
                return;
            }

            if (!config || typeof config !== 'object') {
                specs = EMPTY;
                resolve();
                return;
            }

            let specsConfig = config.config;
            if (typeof specsConfig === 'object') {
                specs = specsConfig;
                resolve(specs);
                return;
            }

            if (typeof specsConfig !== 'string') {
                specs = EMPTY;
                resolve();
                return;
            }

            let path = require('path').resolve(module.dirname, specsConfig);

            // check if path exists
            let fs = require('co-fs');
            if (!(yield (fs.exists(path))) || !(yield (fs.stat(path))).isFile()) {

                specs = EMPTY;
                console.log('server configuration not found on module "'.red + (module.ID).red.bold + '"'.red);
                resolve();
                return;

            }

            try {
                specs = yield fs.readFile(path, {'encoding': 'UTF8'});
                specs = JSON.parse(specs);
            }
            catch (exc) {

                specs = EMPTY;
                console.log('server configuration error on module "'.red + (module.ID).red.bold + '": '.red + (exc.message).red);
                resolve();
                return;

            }

            resolve(specs);

        })
    });

};
