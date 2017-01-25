module.exports = function (application, runtime, order) {
    "use strict";

    let async = require('async');

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);
    let code = new (require('./code.js'))(application, order);

    this.script = async(function *(resolve, reject, language) {

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
