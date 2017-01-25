module.exports = require('async')(function *(resolve, reject, module, processors, processor, config) {
    "use strict";

    let files = yield (require('../../files.js')(module, processor, config));

    let styles = yield processors[processor](files, false);

    if (!styles) {
        resolve();
        return;
    }

    // add an extra tab in all lines
    styles = styles.replace(/\n/g, '\n  ');
    styles = '  ' + styles + '\n';

    // just insert the styles in the script
    let output = '<style>\n' + styles + '</style>';

    resolve(output);

});
