var async = require('async');

module.exports = function (module, config) {
    "use strict";

    return async(function *(resolve, reject, language, overwrites) {

        if (!config.polymer.id) {
            resolve();
            return;
        }

        let script = '';
        script += 'beyond.polymer.register({"' + config.polymer.id + '": "' + module.ID + '"});\n';
        script += 'module.polymer.id = \'' + config.polymer.id + '\'';

        resolve(script);

    });

};
