require('colors');
module.exports = function (path, EMPTY) {
    "use strict";

    let async = require('async');
    let Item = require('./disk/item.js');

    // items in memory
    let items = {};

    this.flush = function () {
        items = {};
    };

    Object.defineProperty(this, 'EMPTY', {
        'get': function () {
            return EMPTY;
        }
    });

    this.get = async(function *(resolve, reject, key) {

        let item;

        // check if item is in memory cache
        item = items[key];
        if (item) {

            resolve(item);
            return;

        }

        // check on disk
        item = new Item(path, key, EMPTY);
        yield item.load();

        if (item.value) {

            // save item into memory cache
            items[key] = item;

            resolve(item);
            return;

        }

        resolve();

    }, this);

    this.value = async(function *(resolve, reject, key) {

        let item = yield this.get(key)
        if (!item) {
            resolve();
            return;
        }

        if (item.value === EMPTY) {
            resolve();
            return;
        }
        else resolve(item.value);

    }, this);

    this.push = async(function *(resolve, reject, key, value) {

        let item = items[key];
        if (!item) item = new Item(path, key);

        // persist item
        yield item.save(value);

        // save item into memory cache
        items[key] = item;

        resolve(item);

    });

    this.remove = async(function *(resolve, reject, key) {

        let item = items[key];
        if (!item) item = new Item(path, key);

        delete items[key];
        yield item.remove();
        resolve();

    });

};
