module.exports = function (module, config) {
    "use strict";

    let items = {};
    let keys = [];

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
            return keys.length;
        }
    });

    let Extend = require('./extend');
    for (let extended in config) {

        let script = new Extend(module, extended, config[extended]);

        keys.push(extended);
        items[extended] = script;

    }

};
