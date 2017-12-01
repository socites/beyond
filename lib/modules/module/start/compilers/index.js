module.exports = function (module, config) {
    "use strict";

    let async = require('async');
    let types = require(require('path').join(require('main.lib'), 'types'));

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

    let multilanguage = new (require('./multilanguage.js'))(module, config);
    if (multilanguage.required) {
        items.multilanguage = async(function *(resolve, reject) {
            resolve(yield multilanguage.process());
        });
        length++;
    }

    if (config.start) {
        items.code = new (require('./code'))(module, config.start);
        length++;
    }

    types.types.forEach(function (elem, type) {

        if (module.types[type] && module.types[type].start) {
            items[type] = module.types[type].start;
            length++;
        }

    });

};
