module.exports = require('async')(function *(resolve, reject, module, config, language) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

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
            output += '    var dependencies = module.dependencies.modules;\n';
            output += '    var react = module.react.items;\n\n';
        }

        output += code;

        if (standalone) {
            output += '})();';
        }
        else {
            output += '    done(\'' + module.ID + '\', \'code\');\n\n';
            output += '})(beyond.modules.get(\'' + module.ID + '\'));';
        }

        return output;

    };

    this.process = function () {

        let script = yield require('./processors.js')(module, config, language);
        script = scope(script, config.standalone);

        let resource = new Resource({'content': script, 'contentType': '.js'});
        resolve(resource);

    };

});
