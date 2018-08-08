module.exports = function (config, runtime) {
    'use strict';

    let async = require('async');

    let items = {}, keys = [];
    Object.defineProperty(this, 'items', {'get': () => items});
    Object.defineProperty(this, 'keys', {'get': () => keys});

    Object.defineProperty(this, 'length', {'get': () => keys.length});

    let initialised;
    this.initialise = async(function* (resolve, reject) {

        if (initialised) {
            resolve();
            return;
        }
        initialised = true;

        let Library = require('./library.js');
        for (let name in config.items) {

            let library;

            library = config.items[name];
            library = new Library(name, library, runtime);
            if (!library.valid) continue;

            yield library.initialise();
            if (!library.valid) continue;

            keys.push(name);
            items[name] = library;

        }

        resolve();

    });

};
