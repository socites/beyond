/**
 * Returns the script of a "code" type
 */
module.exports = function (module, config, error) {
    'use strict';

    let async = require('async');

    config.multilanguage = (config.multilanguage === undefined) ? true : config.multilanguage;
    Object.defineProperty(this, 'multilanguage', {'get': () => config.multilanguage});
    Object.defineProperty(this, 'extname', {'get': () => '.js'});

    // Processors supported by this bundle
    let supports = ['less', 'css', 'txt', 'mustache', 'jsx', 'js'];

    let scope = function (code) {

        let bundle = `${module.ID}/code`;

        // Add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // Add script inside its own function
        let output = '';

        let required = config.dependencies;
        required = (required && required.code instanceof Array) ? required.code : [];
        if (config.less || config.css) required.push('bundles/processors/css/js');
        if (config.html) required.push('bundles/static/hogan.js/hogan-3.0.2.min.amd');
        if (config.html) required.push('bundles/processors/html/js');
        if (config.jsx) required.push('bundles/processors/jsx/js');
        if (config.txt) required.push('bundles/processors/txt/js');

        required = JSON.stringify(required);

        output += `let required = ${required};\n`;
        output += 'define(required, function() {\n\n';
        output += `    let module = beyond.modules.get('${bundle}');\n`;
        output += '    let done = module.done;\n';
        output += '    module = module.module;\n';
        output += '    let react = module.react.items;\n\n';

        if (config.dependencies) {
            output += '    var dependencies = module.dependencies;\n';
            output += `    module.dependencies.set(${JSON.stringify(config.dependencies)});\n\n`;
        }

        output += code;
        output += `    done();\n\n`;
        output += `})(beyond.modules.get('${bundle}'));`;

        return output;

    };

    this.process = async(function* (resolve, reject, language) {

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
            'supports': supports,
            'language': language
        });

        resolve(scope(script));

    });

    this.start = require('./start.js')(module, config, error);

    this.setBuildConfig = async(function* (resolve, reject, json) {
        json.id = config.id;
        json.dependencies = config.dependencies;
        resolve();
    });

};
