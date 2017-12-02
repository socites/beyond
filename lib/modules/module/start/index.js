/**
 * Returns the code of the script
 */
module.exports = function (module, config) {
    "use strict";

    let scoped = function (code) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';
        output += '(function (module) {\n\n';
        output += '    module = module[0];\n\n';
        output += code;
        output += '})(beyond.modules.get(\'' + module.ID + '\'));';

        return output;

    };

    /**
     * @param language
     */
    let async = require('async');
    return async(function *(resolve, reject, language) {

        let compilers = new (require('./compilers'))(module, config);

        let script = '';

        // Process start compilers
        for (let name in compilers.items) {

            let compiler = compilers.items[name];
            let code = yield compiler(module, config, language);

            if (!code) {
                continue;
            }

            let wildcards = Array(name.length + 9).join('*');
            script += '/' + wildcards + '\n';
            script += name + ' compiler\n';
            script += wildcards + '*/\n\n';

            script += code + '\n\n';

        }

        // Compile start processors
        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        let supports = ['less', 'css', 'txt', 'html', 'jsx', 'js'];
        script += yield process(module, 'code', config, supports, language);

        // Scope the output
        let output = '';
        if (script) {
            output = require('./header')(module);
            output += scoped(script);
        }

        // Return the resource
        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
