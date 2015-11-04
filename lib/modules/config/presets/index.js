module.exports = function (config, libraries) {
    "use strict";

    let items = {}, keys = [];
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

    let Preset = require('./preset.js');
    for (let name in config) {

        let preset = new Preset(name, config[name], libraries);
        keys.push(name);
        items[name] = preset;

    }

};
