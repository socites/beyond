/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    let error = require('../../error.js')(module, 'control');

    let multilanguage = (typeof config.multilanguage === 'undefined') ? true : config.multilanguage;
    config.multilanguage = multilanguage;
    Object.defineProperty(this, 'multilanguage', {
        'get': function () {
            return multilanguage;
        }
    });

    Object.defineProperty(this, 'extname', {
        'get': function () {
            return '.html';
        }
    });

    let scope = function (built) {

        // add an extra tab in all lines
        built.styles = built.styles.replace(/\n/g, '\n  ');
        built.styles = '  ' + built.styles + '\n';
        built.code = built.code.replace(/\n/g, '\n    ');
        built.code = '    ' + built.code + '\n';

        // add script inside its own function
        let output = '';
        let id = 'id="' + config.id + '"';
        let is = (config.is) ? ' is="' + config.is + '"' : '';
        output += '<dom-module ' + id + is + '>\n';

        output += '<template>\n';
        output += '\n' + built.styles + '\n';
        output += '</template>\n\n';

        output += '<script>\n\n';
        output += '  (function (params) {\n\n';
        output += '    var done = params[1];\n';
        output += '    var module = params[0];\n';
        output += '    var dependencies = module.dependencies.modules;\n';
        output += '    var react = module.react.items;\n\n';

        if (config.dependencies) {
            output += '    // Control dependencies \n';
            output += '    module.dependencies.set(' + JSON.stringify(config.dependencies) + ');\n\n';
        }

        output += built.code;
        output += '    done(\'' + module.ID + '\', \'code\');\n\n';
        output += '  })(beyond.modules.get(\'' + module.ID + '\'));\n\n';
        output += '</script>' + '\n';

        output += '</dom-module>';

        return output;

    };

    this.process = async(function *(resolve, reject, language) {

        if (!config.id) {
            reject(error('Control resource requires to define its "id"'));
            return;
        }

        if (config.id.indexOf('-') === -1) {
            reject(error('Control element id must have the "-" character'));
            return;
        }

        let built = yield require('./processors')(module, config, language);
        let output = scope(built);
        resolve(output);

    });

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.id = config.id;
        json.dependencies = config.dependencies;

        resolve();

    });

};
