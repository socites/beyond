module.exports = require('async')(function *(resolve, reject, module, processors, processor, config) {
    "use strict";

    let files = yield (require('../../files.js')(module, processor, config));

    let styles = yield processors[processor](files, true);

    let is = '';
    if (typeof config.is === 'string') is = config.is;

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
