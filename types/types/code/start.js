module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (!config.id) {
            resolve('');
            return;
        }

        let script = '';
        script += 'var modulePath = \'/\' + module.path + \'/code\';\n';
        script += 'var host;\n';

        if (module.application) {
            script += 'host = beyond.requireConfig.paths.application;\n';
        }
        else {
            script += 'host = beyond.requireConfig.paths[\'libraries/' + module.library.name + '\'];\n';
        }

        script += 'host += modulePath;\n';

        script += 'requirejs.config({\n';
        script += '    paths: {\n';
        script += '        \'' + config.id + '\': host\n';
        script += '    }\n';
        script += '});\n\n';

        resolve(script);

    });

};
