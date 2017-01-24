module.exports = require('async')(function *(resolve, reject, include, is) {
    "use strict";

    let header = '';
    header += '<!-----------\n';
    header += ' CSS INCLUDES\n';
    header += ' ------------>/\n\n';

    if (typeof is === 'string') is = ' is=\"' + config.is + '\"';
    include = ' include=\"' + include + '\"';

    let output = header + '<style' + is + include + '></style>\n\n';
    resolve(output);

});
