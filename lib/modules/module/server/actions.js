require('colors');
module.exports = function (module, config, runtime, specs, backend) {

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

        initialised = true;

        if (typeof config !== 'object') {
            resolve();
            return;
        }

        value = config.actions;
        if (typeof value !== 'string' || !value) {
            resolve();
            return;
        }

        let path;
        path = require('path').resolve(module.dirname, value);

        // check if path exists
        let fs = require('co-fs');
        if (!(yield (fs.exists(path))) || !(yield (fs.stat(path))).isDirectory()) {
            value = undefined;
            console.log(`actions server "${path}" configuration error`.red);
            resolve();
            return;
        }

        try {

            yield specs.initialise();
            yield backend.initialise();

            let Actions = require(path);
            value = new Actions(runtime, specs.value, backend.value);

        }
        catch (exc) {

            value = undefined;

            let message = (exc instanceof Error) ? exc.stack : exc.message;

            console.error(`Error on actions path "${path}"`.red);
            console.error(message);

        }

        resolve();

    });

};
