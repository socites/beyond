/**
 * Consume the types registered by configuration
 * @param module
 * @param config
 */
module.exports = function (module, config) {
    "use strict";

    let types = require('path').join(require('main.lib'), 'types');
    types = require(types);

    let self = this;

    // Instantiate each type required by the module
    types.registered.forEach(function (Type, name) {

        if (!config[name]) {
            console.error('Type "' + name + '" does not exist.');
            return;
        }

        Type = require('./type.js')(Type);
        self[name] = new Type(module, config[name]);

    });

};
