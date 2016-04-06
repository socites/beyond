var async = require('async');

/**
 * Returns the code of the script
 */
module.exports = function (module, type, config) {
    "use strict";

    let error = require('./error.js')(module);
    let code = require('./code/');

    let typeCode = function () {

        if (typeof type.define === 'boolean' && !type.define) return '';

        let script = '';

        switch (type.type) {

            case 'page':
                script += '    define(function() {\n';
                script += '        if(typeof Page !== "function") {\n';
                script += '            console.warn("Module does not have a Page function");\n';
                script += '            return;\n';
                script += '        }\n';
                script += '        return Page;\n';
                script += '    });\n\n';
                break;

            case 'widget':
                script += '    define(function() {\n';
                script += '        if(typeof Widget !== "function") {\n';
                script += '            console.warn("Module does not have a Widget function");\n';
                script += '            return;\n';
                script += '        }\n';
                script += '        return Widget;\n';
                script += '    });\n\n';
                break;

        }

        return script;

    };

    let scope = function (code, standalone) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';

        if (standalone) {
            output += '(function () {\n\n';
        }
        else {
            output += '(function (params) {\n\n';
            output += '    var done = params[1];\n';
            output += '    var module = params[0];\n';
            output += '    var react = module.react.items;\n\n';
        }

        output += code;
        output += typeCode();

        if (standalone) {
            output += '})();';
        }
        else {
            output += '    done(\'' + module.ID + '\', \'code\');\n\n';
            output += '})(beyond.modules.get(\'' + module.ID + '\'));';

        }


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

        output += scope(script, module.standalone);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

};
