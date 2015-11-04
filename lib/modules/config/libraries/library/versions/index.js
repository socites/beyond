module.exports = function (paths, library, config, specs) {
    "use strict";

    let keys = [];
    let items = {};
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

    if (!config) {
        console.log('WARNING: library "' + library.name + '" does not specify any version');
        return;
    }

    for (let version in config) {

        version = new (require('./version.js'))(paths, library, version, config[version], specs);
        if (!version.valid) continue;

        keys.push(version.version);
        items[version.version] = version;

    }

};
