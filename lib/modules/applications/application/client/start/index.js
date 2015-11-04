var async = require('async');

module.exports = function (application, overwrites, order) {
    "use strict";

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);
    let code = new (require('./script.js'))(application, overwrites, order);

    this.script = async(function *(resolve, reject, language, runtime) {

        if (!language) {
            reject(new Error('language not set.'));
            return;
        }

        let script = '';
        script += yield code(language, runtime);

        // add an extra tab in all lines
        script = script.replace(/\n/g, '\n    ');
        script = '    ' + script + '\n';

        let output = '';
        output += '(function() {\n\n';
        output += script;
        output += '    beyond.start();\n\n';
        output += '})();';

        let resource = new Resource({'content': output, 'contentType': '.js'});
        resolve(resource);

    });

};
