module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (!config.id) {
            reject(error('Control resource requires to define its "id"'));
            return;
        }

        if (config.id.indexOf('-') === -1) {
            reject(error('Control element id must have the "-" character'));
            return;
        }

        let script = '';
        script += 'beyond.controls.register({"' + config.id + '": "' + module.ID + '"});\n';
        script += 'module.control.id = \'' + config.id + '\';';

        resolve(script);

    });

};
