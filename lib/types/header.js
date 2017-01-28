/***
 * Returns the header of the resource
 *
 * @param module {object} the module
 * @param html {boolean} Defines if the header is a html comments style or javascript comments style
 * @returns {string}
 */
module.exports = function (module, extname) {
    "use strict";

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
    if (extname === '.html') {

        output += '<!--';
        output += (new Array(maxLine - 3).join('-'));
        output += '\n' + header;
        output += '\n';
        output += (new Array(maxLine - 1).join('-'));
        output += '-->';

    }
    else {

        output += '/';
        output += (new Array(maxLine).join('*'));
        output += '\n' + header;
        output += '\n';
        output += (new Array(maxLine + 1).join('*'));
        output += '/';

    }

    output += '\n\n';

    return output;

};
