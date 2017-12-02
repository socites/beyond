module.exports = function () {
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

    items.multilanguage = require('./multilanguage.js');
    length++;

};
