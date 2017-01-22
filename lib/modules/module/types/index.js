module.exports = function (module, config) {
    "use strict";

    let types = require('path').join(require('main.lib'), 'types');
    types = require(types);

    if (config.polymer) {
        config.control = config.polymer;
    }

    for (let type in types.registered) {

        if (!config[type]) {
            continue;
        }

        let Class = types.registered[type];
        this[type] = new (types[Class])(module, config[type]);

    }

};
