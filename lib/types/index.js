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
        let creator = require('./creator.js');

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
                let types = new Types(files, error);

                types.registered.forEach(function (Type, name) {
                    registered.set(name, Type);
                });

            }
            catch (exc) {
                console.error('Error on types registration on "' + path + '"');
            }

        }

    };

});
