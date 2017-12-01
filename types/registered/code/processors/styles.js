module.exports = function (template) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, module, processor, process, config, finder, minify, error) {
        "use strict";

        let files;
        files = (template && processor === 'less') ? yield template.getLessModules(module, error) : [];
        files = files.concat(yield (finder(module, 'code', processor, config)));

        let styles = yield process(module, files, true, error);

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
