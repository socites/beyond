var async = require('async');

/**
 * Returns the code of the script
 */
module.exports = function (module, config) {
    "use strict";

    let error = require('./error.js')(module);
    let code = require('./code/');

    let scoped = function (code) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';
        output += '(function (params) {\n\n';
        output += '    var done = params[1];\n';
        output += '    var module = params[0];\n\n';
        output += code;
        output += '    done(\'' + module.ID + '\', \'code\');\n\n';
        output += '})(beyond.modules.get(\'' + module.ID + '\'));';

        return output;

    };

    /**
     * @param language
     * @param overwrite is actually used only by the script "custom"
     */
    return async(function *(resolve, reject, language) {

        if (module.localized && !language) {

            let message = 'language not set on localized module';
            reject(error(message));
            return;

        }

        let script = yield code(module, config, language);

        let output = require('./header')(module);

        if (!module.standalone) output += scoped(script);
        else output += script;

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
