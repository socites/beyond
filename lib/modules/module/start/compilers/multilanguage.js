module.exports = require('async')(function *(resolve, reject, module, config) {
    "use strict";

    let types = require('path').join(require('main.lib'), 'types');
    types = require(types).types;
    types = Array.from(types.keys());

    let multilanguage = [];
    for (var type of types) {
        if (module.types[type] && module.types[type].multilanguage) {
            multilanguage.push(type);
        }
    }

    if (!multilanguage.length) {
        resolve();
        return;
    }

    let script = '';
    script += 'beyond.modules.multilanguage.set(\'' + module.ID + '\', ' + JSON.stringify(multilanguage) + ');\n';
    resolve(script);

});
