module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    var length = 0;
    Object.defineProperty(this, 'length', {
        'get': function () {
            return length;
        }
    });

    let items = {};
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });

    if (config.page) {
        items.page = new (require('./page.js'))(module, config.page);
        length++;
    }

    if (config.start) {
        items.code = new (require('./code'))(module, config.start);
        length++;
    }

    // items.multilanguage must be first than items.polymer and it is always included
    let multilanguage = new (require('./multilanguage.js'))(module, config);
    if (multilanguage.required) {
        items.multilanguage = async(function *(resolve, reject) {
            resolve(yield multilanguage.process());
        });
        length++;
    }

    if (config.polymer) {
        items.polymer = new (require('./polymer.js'))(module, config);
        length++;
    }

};
