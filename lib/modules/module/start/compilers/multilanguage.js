module.exports = require('async')(function *(resolve, reject, module, config) {
    "use strict";

    let types = require('path').join(require('main.lib'), 'types');
    types = require(types).types;

    let multilanguage = [];

    for (let type in types) {
        if (config[type] && config[type].multilanguage) {
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
