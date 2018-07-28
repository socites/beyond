/**
 * Compiles typescript
 */
module.exports = function (module, config, error) {
    'use strict';

    let async = require('async');

    Object.defineProperty(this, 'multilanguage', {
        'get': () => false
    });

    Object.defineProperty(this, 'extname', {
        'get': () => '.js'
    });

    let scope = function (code, standalone) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';

        if (standalone) {
            output += '(function () {\n\n';
        }
        else {
            output += '(function (params) {\n\n';
            output += '    var done = params[1];\n';
            output += '    var module = params[0];\n\n';

            if (config.dependencies) {
                output += '    var dependencies = module.dependencies;\n';
                output += '    module.dependencies.set(' + JSON.stringify(config.dependencies) + ');\n\n';
            }
        }

        output += code;

        if (standalone) {
            output += '})();';
        }
        else {
            output += '    done(\'' + module.ID + '\', \'code\');\n\n';
            output += '})(beyond.modules.get(\'' + module.ID + '\'));';
        }

        return output;

    };

    this.process = async(function* (resolve, reject, language) {

        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        let script = yield process({
            'module': module,
            'type': 'code',
            'config': config,
            'supports': ['js'],
            'language': language
        });

        script = scope(script, config.standalone);
        resolve(script);

    });

    this.setBuildConfig = async(function* (resolve, reject, json) {

        json.id = config.id;
        json.dependencies = config.dependencies;

        resolve();

    });

};
