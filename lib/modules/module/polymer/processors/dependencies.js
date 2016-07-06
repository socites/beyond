var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config) {

        if (typeof config !== 'object') {
            reject(error('Invalid dependencies processor configuration'));
            return;
        }


        let output = '';
        output += '/******************** \n';
        output += ' CONTROL DEPENDENCIES \n';
        output += ' ********************/\n\n';

        output += '<script>\n';
        output += '(function (params) {\n\n';
        output += '    var module = params[0];\n';
        output += '    module.dependencies = ' + JSON.stringify(config) + ';\n\n';
        output += '})(beyond.modules.get(\'' + module.ID + '\'));\n\n';
        output += '</script>\n\n';

        resolve(output);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'js';
        }
    });

};
