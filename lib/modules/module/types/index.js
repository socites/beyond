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
    types.types.forEach(function (Type, name) {

        if (!config[name]) {
            return;
        }

        Type = require('./type.js')(Type, name);
        self[name] = new Type(module, config[name]);

    });

};
