/**
 * The types registry
 */
module.exports = new (function () {
    "use strict";

    let _types = new Map();
    Object.defineProperty(this, 'types', {
        'get': function () {
            return _types;
        }
    });

    let _processors = new Map();
    Object.defineProperty(this, 'processors', {
        'get': function () {
            return _processors;
        }
    });

    this.initialise = function (config) {

        let root = process.cwd();

        if (!config) {
            return;
        }
        if (!(config instanceof Array)) {
            console.error('Types configuration is invalid');
            return;
        }

        for (let path of config) {

            path = require('path').join(root, path);
            try {

                let registering = new (require(path));

                let processors = registering.processors;
                if (processors instanceof Map) {

                    processors.forEach(function (processor, name) {

                        if (_processors.has(name)) {
                            console.error('Processor "' + name + '" is already registered');
                            return;
                        }

                        console.log('Registering processor "' + name + '"');
                        _processors.set(name, processor);

                    });

                    console.log('');

                }

                let types = registering.types;
                if (types instanceof Map) {

                    types.forEach(function (Type, name) {

                        if (_types.has(name)) {
                            console.error('Type "' + name + '" is already registered');
                            return;
                        }

                        console.log('Registering type "' + name + '"');
                        _types.set(name, Type);

                    });

                    console.log('');

                }

            }
            catch (exc) {
                console.error('Error on types registration on "' + path + '" ' + exc.message);
                console.log(exc.stack);
            }

        }

    };

});
