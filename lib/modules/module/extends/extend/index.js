module.exports = function (module, extended, config) {
    "use strict";

    let async = require('async');

    let error = require('./error.js')({'module': module, 'extends': extended});

    if (typeof config !== 'object' || !config) return;

    let code = require('../../code');

    let scoped = function (code) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';
        output += '(function (params) {\n\n';
        output += '    var module = params[0];\n';
        output += '    var extending = params[1];\n\n';
        output += code;
        output += '})(beyond.modules.get(\'' + module.ID + '\', \'libraries/' + extended + '\'));';

        return output;

    };

    /**
     * Returns the code of the extension
     *
     * @param language
     * @param overwrite is actually used only by the script "custom"
     */
    this.code = async(function *(resolve, reject, language, overwrites) {

        if (!overwrites) overwrites = {};

        let script = yield code(module, config, language, overwrites);

        let output = require('./header')(module);

        output += scoped(script);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);
        let resource = new Resource({'content': output, 'contentType': '.js'});

        resolve(resource);

    });

    Object.defineProperty(this, 'multilanguage', {
        'get': async(function *(resolve) {
            resolve(config.multilanguage);
        })
    });

};
