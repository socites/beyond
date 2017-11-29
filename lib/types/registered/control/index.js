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

    let scope = function (script) {

        // add an extra tab in all lines
        script = script.replace(/\n/g, '\n    ');
        script = '    ' + script + '\n';

        // add script inside its own function
        let output = '';
        let id = 'id="' + config.id + '"';
        let is = (config.is) ? ' is="' + config.is + '"' : '';
        output += '<dom-module ' + id + is + '>\n';

        output += '<script>\n\n';
        output += '  (function (params) {\n\n';
        output += '    var done = params[1];\n';
        output += '    var module = params[0];\n';
        output += '    var dependencies = module.dependencies.modules;\n';
        output += '    var react = module.react.items;\n\n';

        let dependencies = (config.dependencies) ? config.dependencies : {};
        dependencies.require = (dependencies.require) ? dependencies.require : {};
        dependencies.require.react = 'React';
        dependencies.require['react-dom'] = 'ReactDOM';

        if (module.config.custom) {
            if (!module.library) {
                throw new Error('"Custom" processors only apply to modules that resides in a library');
            }
            let custom = 'application/custom/' + module.library.name + '/' + module.path;
            dependencies.require[custom] = 'custom';
        }

        if (dependencies) {
            output += '    // Control dependencies \n';
            output += '    module.dependencies.set(' + JSON.stringify(dependencies) + ');\n\n';
        }

        if (typeof config.properties === 'object') {
            output += '    module.properties = ' + JSON.stringify(config.properties) + '\n\n';
        }

        if (config.methods instanceof Array) {
            output += '    module.control.methods = ' + JSON.stringify(config.methods) + '\n\n';
        }

        output += script;
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

        let script = yield require('./processors')(module, config, language);
        let output = scope(script);
        resolve(output);

    });

    this.start = require('./start.js')(module, config);

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.id = config.id;
        json.dependencies = config.dependencies;

        resolve();

    });

};
