/**
 * Convert the list of files of the overwrites into
 * a finder object for each processor
 */
module.exports = function (moduleID, overwrites) {
    "use strict";

    let Finder = require('finder');

    // take out the 'libraries/' from the moduleID ('libraries/'.length === 10)
    overwrites = overwrites.items[moduleID.substr(10)];

    if (!overwrites || !overwrites.custom) {
        return {};
    }

    let dirname = overwrites.dirname;
    overwrites = overwrites.custom;

    if (overwrites.less instanceof Array && overwrites.less.length) {
        overwrites.less = new Finder(dirname, {
            'list': overwrites.less, 'usekey': 'relative.file'
        });
    }
    else {
        delete overwrites.less;
    }

    if (overwrites.css instanceof Array && overwrites.css.length) {
        overwrites.css = new Finder(dirname, {
            'list': overwrites.css, 'usekey': 'relative.file'
        });
    }
    else {
        delete overwrites.css;
    }

    if (overwrites.txt instanceof Array && overwrites.txt.length) {
        overwrites.txt = new Finder(dirname, {
            'list': overwrites.txt, 'usekey': 'relative.file'
        });
    }
    else {
        delete overwrites.txt;
    }

    return overwrites;

};
