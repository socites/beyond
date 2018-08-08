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

        let dependencies = new (require('./dependencies.js'))(config);
        let required = JSON.stringify(dependencies.required);
        output += `let required = ${required};\n`;
        output += 'define(required, function() {\n\n';

        output += (dependencies.script) ? `${dependencies.script}\n` : '';

        output += `    let module = beyond.modules.get('${bundle}');\n`;
        output += '    let done = module.done;\n';
        output += '    module = module.module;\n\n';

        output += (config.jsx) ? '    let react = module.react.items;\n\n' : '';

        output += code;
        output += '    // Inform that the module is done\n';
        output += `    done();\n\n`;
        output += `});`;

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
