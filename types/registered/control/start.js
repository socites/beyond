module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, language, template) {

        if (!config.id) {
            resolve();
            return;
        }

        let script = '';
        script += 'beyond.controls.register({"' + config.id + '": "' + module.ID + '"});\n';
        script += 'module.control.id = \'' + config.id + '\';';

        resolve(script);

    });

};
