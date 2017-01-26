module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (!config.control.id) {
            resolve();
            return;
        }

        let script = '';
        script += 'beyond.controls.register({"' + config.control.id + '": "' + module.ID + '"});\n';
        script += 'module.controls.id = \'' + config.control.id + '\'';

        resolve(script);

    });

};
