module.exports = function (library, config, runtime) {
    "use strict";

    let keys = [], items = {};
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'length', {
        'get': function () {
            return keys.length;
        }
    });

    for (let version in config.items) {

        version = new (require('./version.js'))(library, version, config.items[version], runtime);

        keys.push(version.version);
        items[version.version] = version;

    }

};
