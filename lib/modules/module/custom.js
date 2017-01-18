var async = require('async');

/**
 * Returns the custom of the script
 */
module.exports = function (module, type, config) {
    "use strict";

    let error = require('./error.js')(module);
    let code = require('./code/');

    let scoped = function (code) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';
        output += '(function (module) {\n\n';
        output += '    var done = module[1];\n';
        output += '    module = module[0];\n\n';
        output += code;
        output += '    done(\'' + module.ID + '\', \'custom\');\n\n';
        output += '})(beyond.modules.get(\'' + module.ID + '\'));';

        return output;

    };

    /**
     * @param language
     * @param overwrite the overwrites files of the processors
     */
    return async(function *(resolve, reject, language, overwrites) {

        if (module.multilanguage && !language) {

            let message = 'Language must be set on a custom set of script "'.red + (script).red.bold +
                '" of module "'.red + (module.ID).red.bold + '"'.red;

            reject(error(message));
            return;

        }

        if (!overwrites) overwrites = {};

        let custom = yield code(module, config, language, overwrites);

        let output = require('./header')(module);
        output += scoped(custom);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
