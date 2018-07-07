require('colors');

/**
 * The server configuration.
 *
 * @param module
 * @param config
 */
module.exports = function (module, config) {

    let value;
    Object.defineProperty(this, 'value', {
        'get': function () {
            return value;
        }
    });

    let initialised;
    Object.defineProperty(this, 'initialised', {
        'get': function () {
            return !!initialised;
        }
    });

    this.initialise = require('async')(function* (resolve) {

        if (initialised) {
            resolve();
            return;
        }

        if (!config || typeof config !== 'object') {
            resolve();
            return;
        }

        let value = config.config;
        if (typeof value === 'object') {
            resolve();
            return;
        }

        if (typeof value !== 'string') {
            value = undefined;
            console.error(`Invalid server specification on module "${module.ID}"`.red);
            resolve();
            return;
        }

        let path = require('path').resolve(module.dirname, value);

        // check if path exists
        let fs = require('co-fs');
        if (!(yield (fs.exists(path))) || !(yield (fs.stat(path))).isFile()) {

            value = undefined;
            console.log(`server configuration not found on module "${module.ID}"`.red);
            resolve();
            return;

        }

        try {
            value = yield fs.readFile(path, {'encoding': 'UTF8'});
            value = JSON.parse(value);
        }
        catch (exc) {

            value = undefined;
            console.log(`server configuration error on module "${module.ID}" - ${exc.message}`.red);
            resolve();

        }

    });

};
