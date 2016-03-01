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

    if (config.widget) {
        items.widget = new (require('./widget.js'))(module, config.widget);
        length++;
    }

    if (config.start) {
        items.code = new (require('./code.js'))(module, config.start);
        length++;
    }

};
