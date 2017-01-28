require('colors');
module.exports = function (library, version, excludes, runtime) {
    "use strict";

    let async = require('async');

    let modules = version.modules;
    Object.defineProperty(this, 'library', {
        'get': function () {
            return library;
        }
    });
    Object.defineProperty(this, 'version', {
        'get': function () {
            return version;
        }
    });

    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return modules.dirname;
        }
    });

    let items, keys;
    Object.defineProperty(this, 'processed', {
        'get': function () {
            return modules.processed;
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

    let processed, processing;
    let callbacks = [];
    this.process = async(function *(resolve, reject) {

        if (processed) {
            resolve();
            return;
        }
        if (processing) {
            callbacks.push(resolve);
            return;
        }

        processing = true;

        yield modules.process();

        keys = [];
        items = {};

        for (let key of modules.keys) {

            if (excludes.indexOf(key) !== -1) continue;

            keys.push(key);
            items[key] = modules.items[key];

        }

        processed = true;
        resolve();
        for (var i in callbacks) {
            callbacks[i]();
        }

    });

    this.module = async(function *(resolve, reject, path) {

        if (excludes.indexOf(path) !== -1) {
            resolve();
            return;
        }

        let module = yield version.modules.module(path);
        resolve(module);

    });

};
