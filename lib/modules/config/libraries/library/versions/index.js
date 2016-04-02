module.exports = function (paths, library, config, runtime) {
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
        console.log('WARNING: library "'.yellow + (library.name).yellow.bold + '" does not specify any version.'.yellow);
        return;
    }

    for (let version in config) {

        version = new (require('./version.js'))(paths, library, version, config[version], runtime);
        if (!version.valid) continue;

        keys.push(version.version);
        items[version.version] = version;

    }

};
