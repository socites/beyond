var async = require('async');

/**
 * Returns the custom of the script
 */
module.exports = function (module, config) {
    "use strict";

    let error = require('../error.js')(module);
    let processors = require('./processors.js');

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
     * @param template the template with less functions and the overwrites files of the processors
     */
    return async(function *(resolve, reject, language, template) {

        let custom = yield processors(module, config, language, template);

        let output = scoped(custom);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
