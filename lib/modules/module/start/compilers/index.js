module.exports = function () {
    'use strict';

    let length = 0;
    Object.defineProperty(this, 'length', {'get': () => length});

    let items = {};
    Object.defineProperty(this, 'items', {'get': () => items});

    items.multilanguage = require('./multilanguage.js');
    length++;

};
