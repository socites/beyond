/**
 * Returns the script of a "code" type
 */
module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');

    let multilanguage = (typeof config.multilanguage === 'undefined') ? true : config.multilanguage;
    config.multilanguage = multilanguage;
    Object.defineProperty(this, 'multilanguage', {
        'get': function () {
            return multilanguage;
        }
    });

    Object.defineProperty(this, 'extname', {
        'get': function () {
            return '.js';
        }
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
            output += '    var module = params[0];\n';
            output += '    var react = module.react.items;\n\n';

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

    this.process = async(function *(resolve, reject, language) {

        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        if (config.html) {
            config.mustache = config.html;
            delete config.html;
        }

        let script = yield process({
            'module': module,
            'type': 'code',
            'config': config,
            'supports': ['less', 'css', 'txt', 'mustache', 'jsx', 'js'],
            'language': language
        });

        script = scope(script, config.standalone);
        resolve(script);

    });

    this.start = require('./start.js')(module, config, error);

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.id = config.id;
        json.dependencies = config.dependencies;

        resolve();

    });

};
