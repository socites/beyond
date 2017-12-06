/**
 * Returns the custom of the script
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
        output += '    var done = module[1];\n';
        output += '    module = module[0];\n\n';
        output += code;
        output += '    done(\'' + module.ID + '\', \'custom\');\n\n';
        output += '})(beyond.modules.get(\'' + module.ID + '\'));';

        return output;

    };

    /**
     * @param language
     * @param template the template with less template variables and the overwrites files of the processors
     */
    let async = require('async');
    return async(function *(resolve, reject, language, template) {

        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        let script = yield process({
            'module': module,
            'type': 'custom',
            'config': config,
            'supports': ['less', 'txt'],
            'language': language,
            'template': template
        });

        let output = scoped(script);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
