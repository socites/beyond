/**
 * Returns the resource of a "polymer" type
 */
module.exports = function (module, config) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    let async = require('async');

    let error = require('../../error.js')(module, 'polymer');

    let multilanguage = (typeof config.multilanguage === 'undefined') ? true : config.multilanguage;
    Object.defineProperty(this, 'multilanguage', {
        'get': function () {
            return multilanguage;
        }
    });

    let scope = function (code) {

        // add an extra tab in all lines
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';

        // add script inside its own function
        let output = '';
        output += '<dom-module id="' + config.id + '"';

        if (config.is) {
            output += ' is="' + config.is + '"';
        }

        output += '>\n\n';
        output += code;
        output += '</dom-module>';

        return output;

    };

    this.process = async(function *(resolve, reject, language) {

        if (!config.id) {
            let message = 'Polymer resource requires to define its "id"';
            reject(error(message));
            return;
        }

        if (config.id.indexOf('-') === -1) {
            let message = 'Polymer element id must have the "-" character';
            reject(error(message));
            return;
        }

        let resource = yield require('./processors.js')(module, config, language);

        let code = resource.dependencies;
        if (code) code += '\n';
        code += scope(resource['dom-module']);

        resource = new Resource({'content': code, 'contentType': '.js'});
        resolve(resource);

    });

};
