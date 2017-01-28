module.exports = function (module) {
    "use strict";

    let async = require('async');

    let header = [];

    if (module.library) header.push('LIBRARY NAME: ' + module.library.name);
    header.push('MODULE: ' + module.path);

    // how many chars has the bigger line in the header
    // used to write the asterisks of the comment
    let maxLine;
    for (let i in header) {
        if (!maxLine) {
            maxLine = header[i].length;
        }

        if (maxLine < header[i].length) {
            maxLine = header[i].length;
        }
    }

    header = header.join('\n');

    let output = '';
    output += '/';
    output += (new Array(maxLine).join('*'));
    output += '\n' + header;
    output += '\n';
    output += (new Array(maxLine + 1).join('*'));
    output += '/\n\n';

    return output;

};
