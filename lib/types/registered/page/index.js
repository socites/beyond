/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    let multilanguage = (typeof config.multilanguage === 'undefined') ? true : config.multilanguage;
    config.multilanguage = multilanguage;
    Object.defineProperty(this, 'multilanguage', {
        'get': function () {
            return multilanguage;
        }
    });

    Object.defineProperty(this, 'extname', {
        'get': function () {
            return '.js';
        }
    });

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

    this.process = async(function *(resolve, reject, language) {

        let script = yield require('./processors.js')(module, config, language);
        script = scope(script);
        resolve(script);

    });

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.route = config.route;
        json.dependencies = config.dependencies;

        resolve();

    });

};
