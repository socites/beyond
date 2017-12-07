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

        // Process the start of each type configured in the module
        // Ex. set the route configuration of the 'page' type
        let types = require('path').join(require('main.lib'), 'types');
        types = Array.from(require(types).types.keys());
        for (let type of types) {
            if (module.types[type] && module.types[type].start) {
                script += yield module.types[type].start();
            }
        }

        // Compile start processors (js, less, etc.)
        if (config.start) {

            let process = require('path').join(require('main.lib'), 'types/process');
            process = require(process);

            if (config.start && config.start.html) {
                config.start.mustache = config.start.html;
                delete config.start.html;
            }

            script += yield process({
                'module': module,
                'type': 'start',
                'config': config.start,
                'supports': ['less', 'css', 'txt', 'mustache', 'jsx', 'js'],
                'language': language
            });

        }

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
