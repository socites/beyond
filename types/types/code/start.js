module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject) {

        if (!config.id) {
            resolve('');
            return;
        }

        let script = '';
        script += 'var type = \'/\' + module.path + \'/code\';\n';
        script += 'var host = beyond.requireConfig.paths[\'libraries/' + module.library.name + '\'] + type;\n';
        script += 'requirejs.config({\n';
        script += '    paths: {\n';
        script += '        \'page.basic\': host\n';
        script += '    }\n';
        script += '});\n\n';

        resolve(script);

    });

};
