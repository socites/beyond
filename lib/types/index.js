/**
 * The types registry
 */
module.exports = new (function () {
    "use strict";

    this.header = require('./header.js');

    let registered = new Map();
    Object.defineProperty(this, 'registered', {
        'get': function () {
            return registered;
        }
    });

    this.initialise = function (types) {

        let error = require('./error.js');
        let files = new (require('./files.js'))(error);

        let root = process.cwd();

        if (!types) {
            return;
        }
        if (!(types instanceof Array)) {
            console.error('Types configuration is invalid');
            return;
        }

        for (let path of types) {

            path = require('path').join(root, path);
            try {

                let Types = require(path);
                let registering = (new Types(files, error)).registered;

                registering.forEach(function (Type, name) {

                    if (registered.has(name)) {
                        console.error('Type "' + name + '" is already registered');
                        return;
                    }

                    registered.set(name, Type);

                });

            }
            catch (exc) {
                console.error('Error on types registration on "' + path + '"');
            }

        }

    };

});
