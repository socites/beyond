module.exports = function (module, config) {
    "use strict";

    let types = require('path').join(require('main.lib'), 'types');

    for (let i in types.registered) {

        let type = types.registered[i];
        if (!config[type]) {
            continue;
        }

        if (typeof config[type].multilanguage === 'undefined') {
            config[type].multilanguage = true;
        }
        else {
            config[type].multilanguage = !!type.multilanguage;
        }

        this[type] = new (types[type])(module, config[type]);

    }

};
