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
        let files = require('./files.js');
        let error = require('./error.js');

        let script = '';

        for (let name in compilers.items) {

            let compiler = compilers.items[name];
            let code = yield compiler(module, config, language, files, error);

            if (!code) {
                continue;
            }

            let wildcards = Array(name.length + 9).join('*');
            script += '/' + wildcards + '\n';
            script += name + ' compiler\n';
            script += wildcards + '*/\n\n';

            script += code + '\n\n';

        }

        let output = require('./header')(module);
        output += scoped(script);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
