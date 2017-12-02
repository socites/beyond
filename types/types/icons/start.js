module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (!config.id || !config.name || (!config.files && !config.source)) {
            reject(error('Icons resource requires to define the id, name and files properties'));
            return;
        }

        let script = '';
        let register = {
            'path': module.ID,
            'type': 'icons'
        };
        script += 'beyond.controls.register({"' + config.id + '": ' + JSON.stringify(register) + '});\n';
        script += 'module.control.id = \'' + config.id + '\';';

        resolve(script);

    });

};
