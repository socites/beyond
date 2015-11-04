var async = require('async');

require('colors');
module.exports = function (application, libraries, runtime) {
    "use strict";

    let Finder = require('finder');

    const filename = 'module.json';
    let filter = function (file) {

        if (typeof file === 'string') {
            if (require('path').basename(file) !== filename) return true;
        }
        else if (typeof file === 'object') {

            if (file.filename !== filename) return true;
            file = file.file;

        }

        // exclude the modules that are defined inside libraries
        for (let library of libraries.keys) {

            library = libraries.items[library];
            if (require('path').relative(library.dirname, file).substr(0, 3) !== '../') {
                return true;
            }

        }

    };

    let finder = new Finder(application.dirname, {'search': filter, 'filename': filename});

    let items, keys;
    Object.defineProperty(this, 'processed', {
        'get': function () {
            return !!items;
        }
    });
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });

    Object.defineProperty(this, 'length', {
        'get': function () {
            if (keys) return keys.length;
        }
    });

    this.process = async(function *(resolve, reject) {

        if (finder.processed) {
            resolve();
            return;
        }

        yield finder.process();

        items = {};
        keys = [];
        for (let key of finder.keys) {

            let file = finder.items[key];

            let module;
            try {
                module = yield require('./module')(application, file.relative.dirname, runtime);
            }
            catch (exc) {
                console.log('WARNING:'.yellow, exc.message);
                continue;
            }

            keys.push(key);
            items[key] = module;

        }

        resolve();

    });

    this.module = async(function *(resolve, reject, path) {

        let file = require('path').join(path, filename);
        if (filter(file)) {
            resolve();
            return;
        }

        if (items) {
            resolve(items[path]);
            return;
        }

        if (!(yield finder.exists(path))) {
            resolve();
            return;
        }
        else {
            let module = yield require('./module')(application, path);
            resolve(module);
        }

    });

};
