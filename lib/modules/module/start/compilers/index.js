module.exports = function (module, config) {
    "use strict";

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
        items.code = new (require('./code.js'))(module, config.start);
        length++;
    }

    // items.multilanguage must be first than items.polymer
    if (module.library) {
        items.multilanguage = new (require('./multilanguage.js'))(module, config);
        length++;
    }

    if (config.polymer) {
        items.polymer = new (require('./polymer.js'))(module, config);
        length++;
    }

};
