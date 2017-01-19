var async = require('async');

/**
 * Returns the code of a page script
 */
module.exports = function (module, config) {
    "use strict";

    let error = require('./error.js')(module);
    let code = require('./code/');

    let scope = function (code) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';
        output += '(function (params) {\n\n';
        output += '    var done = params[1];\n';
        output += '    var module = params[0];\n';
        output += '    var dependencies = module.dependencies.modules;\n';
        output += '    var react = module.react.items;\n\n';

        output += code;

        output += '    define(function() {\n';
        output += '        if(typeof Page !== "function") {\n';
        output += '            console.warn("Module does not have a Page function");\n';
        output += '            return;\n';
        output += '        }\n';
        output += '        return Page;\n';
        output += '    });\n\n';

        output += '    done(\'' + module.ID + '\', \'code\');\n\n';
        output += '})(beyond.modules.get(\'' + module.ID + '\'));';

        return output;

    };

    /**
     * @param language
     * @param overwrite is actually used only by the script "custom"
     */
    return async(function *(resolve, reject, language) {

        if (config.multilanguage && !language) {

            let message = 'Language must be set on a multilanguage module';
            reject(error(message));
            return;

        }

        let script = yield code(module, config, language);

        let output = require('./header')(module);

        output += scope(script, module.standalone);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
