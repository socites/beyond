var async = require('async');

module.exports = function (module, config) {
    "use strict";

    return async(function *(resolve, reject, language) {

        let multilanguage = [];

        if (config.code && config.code.multilanguage) {
            multilanguage.push('code');
        }
        if (config.polymer && config.polymer.multilanguage) {
            multilanguage.push('polymer');
        }

        if (!multilanguage.length) {
            resolve();
            return;
        }

        let script = '';
        script += 'beyond.modules.multilanguage.set(\'' + module.ID + '\', ' + JSON.stringify(multilanguage) + ');\n';
        resolve(script);

    });

};
