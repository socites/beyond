module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

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
