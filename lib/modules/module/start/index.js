/**
 * Returns the code of the script
 */
module.exports = function (module, config) {
    "use strict";

    if (typeof config.start !== 'object' &&
        typeof config.widget !== 'object' &&
        typeof config.polymer !== 'object' &&
        (typeof config.page !== 'object' && typeof config.page !== 'string')) return;

    let error = require('./error.js')(module);

    let compilers = new (require('./compilers'))(module, config);
    if (!compilers.length) return;

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

    var async = require('async');

    /**
     * @param language
     * @param overwrite is actually used only by the script "custom"
     */
    return async(function *(resolve, reject, language, overwrites) {

        if (module.localized && !language) {

            let message = 'language not set on start script '.red +
                'of module "'.red + (module.ID).red.bold + '"'.red;

            reject(error(message));
            return;

        }

        if (!overwrites) overwrites = {};

        let script = '';

        for (let compilerName in compilers.items) {

            let compiler = compilers.items[compilerName];
            let code = yield compiler(language, overwrites);

            if (!code) continue;

            let wildcards = Array(compilerName.length + 9).join('*');
            script += '/' + wildcards + '\n';
            script += compilerName + ' compiler\n';
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
