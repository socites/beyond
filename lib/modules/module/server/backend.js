require('colors');
module.exports = function (module, config, runtime, specs) {

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

        let value = config.backend;
        if (typeof value !== 'string' || !value) {
            resolve();
            return;
        }

        let path = require('path').resolve(module.dirname, value);

        // check if path exists
        let fs = require('co-fs');
        if (!(yield (fs.exists(path))) || !(yield (fs.stat(path))).isDirectory()) {

            value = undefined;
            console.log(`backend server configuration not found on module "${module.ID}"`.red);
            resolve();
            return;

        }

        try {

            let Backend = require(path);
            if (typeof Backend !== 'function') {

                value = undefined;
                console.log(`Backend "${path}" does not expose a function.`);
                resolve();
                return;

            }

            let specs = yield specs.initialise();
            value = new Backend(runtime, specs.value);

        }
        catch (exc) {

            value = undefined;
            console.log(exc.stack);
            resolve();

        }

    });

};
