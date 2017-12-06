/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config, error) {
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

        let custom = 'undefined';
        if (module.config.custom) {
            if (!module.library) {
                throw new Error('"Custom" processors only apply to modules that resides in a library');
            }
            custom = '"application/custom/' + module.library.name + '/' + module.path + '"';
        }

        // add script inside its own function
        let output = '';
        output += '(function (params) {\n\n';
        output += '    var done = params[1];\n';
        output += '    var module = params[0];\n';
        output += '    var dependencies = module.dependencies.modules;\n';
        output += '    var react = module.react.items;\n\n';
        output += '    var custom = ' + custom + ';\n\n';

        output += code;

        output += '    define([custom], function() {\n';
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

        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        if (config.html) {
            config.mustache = config.html;
            delete config.html;
        }

        let script = yield process({
            'module': module,
            'type': 'page',
            'config': config,
            'supports': ['less', 'css', 'txt', 'mustache', 'jsx', 'js'],
            'language': language
        });

        let output = scope(script);
        resolve(output);

    });

    this.start = require('./start.js')(module, config, error);

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.route = config.route;
        json.dependencies = config.dependencies;
        json.template = config.template;

        resolve();

    });

};
