require('colors');
module.exports = function (module, config, specs) {
    "use strict";

    let async = require('async');

    let Finder = require('finder');
    let finder = new Finder(module.dirname, {'list': config, 'usekey': 'relative.file'});

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    Object.defineProperty(this, 'config', {
        'get': function () {
            return config;
        }
    });

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

        yield finder.process();

        let process = require('./process.js');

        items = {};
        keys = [];
        for (let key in finder.items) {

            let file = finder.items[key];
            let resource;
            resource = new Resource({'file': file.file, 'relative': file.relative});
            resource = yield process(resource, module, specs);

            keys.push(key);
            items[key] = resource;

        }

        resolve();

    });

    this.resource = async(function *(resolve, reject, key) {

        if (items) {
            resolve(items[key]);
            return;
        }

        if (!(yield finder.exists(key))) {
            resolve();
            return;
        }
        else {

            let process = require('./process.js');

            let file = require('path').join(module.dirname, key);
            let resource = new Resource({'file': file});
            resolve(yield process(resource, module, specs));

        }

    });

};
