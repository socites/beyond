module.exports = function (template) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, module, processors, processor, config) {
        "use strict";

        let error = require('../../error.js')(module);

        let files;
        files = yield template.getLessModules(module, error);
        files = files.concat(yield (require('./files.js')(module, processor, config)));
        files = files.concat(yield template.getCustomOverwrites(module, processor, error));

        let styles = yield processors[processor](files, true);

        let is = (typeof config.is === 'string') ? config.is : '';

        // just insert the styles in the script
        let output = '';
        output += '/**********\n';
        output += ' CSS STYLES\n';
        output += ' **********/\n\n';
        output += '(function() {\n';
        output += '\tvar styles = \'' + styles + '\';\n';
        output += '\tvar is = \'' + is + '\';\n';
        output += '\tmodule.styles.push(styles, is);\n';
        output += '})();\n\n';

        resolve(output);

    });

};
