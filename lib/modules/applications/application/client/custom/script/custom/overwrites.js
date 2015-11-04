module.exports = function (overwrites, moduleID) {
    "use strict";

    let Finder = require('finder');

    // take out the 'libraries/' from the moduleID ('libraries/'.length === 10)
    overwrites = overwrites.items[moduleID.substr(10)];

    if (!overwrites || !overwrites.custom) return {};

    let dirname = overwrites.dirname;

    overwrites = overwrites.custom;
    overwrites = {
        'css': overwrites.css,
        'txt': overwrites.txt
    };

    if (overwrites.css && overwrites.css.length) {
        let finder = new Finder(dirname, {
            'list': overwrites.css, 'usekey': 'relative.file'
        });

        overwrites.css = finder;
    }

    if (overwrites.txt && overwrites.txt.length) {
        let finder = new Finder(dirname, {
            'list': overwrites.txt, 'usekey': 'relative.file'
        });

        overwrites.txt = finder;
    }

    return overwrites;

};
