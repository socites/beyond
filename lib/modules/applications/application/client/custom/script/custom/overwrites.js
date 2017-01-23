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

    overwrites = {
        'less': overwrites.less,
        'css': overwrites.css,
        'txt': overwrites.txt
    };

    if (overwrites.less instanceof Array && overwrites.less.length) {
        let finder = new Finder(dirname, {
            'list': overwrites.less, 'usekey': 'relative.file'
        });

        overwrites.less = finder;
    }
    else {
        delete overwrites.less;
    }

    if (overwrites.css instanceof Array && overwrites.css.length) {
        let finder = new Finder(dirname, {
            'list': overwrites.css, 'usekey': 'relative.file'
        });

        overwrites.css = finder;
    }
    else {
        delete overwrites.css;
    }

    if (overwrites.txt instanceof Array && overwrites.txt.length) {
        let finder = new Finder(dirname, {
            'list': overwrites.txt, 'usekey': 'relative.file'
        });

        overwrites.txt = finder;
    }
    else {
        delete overwrites.txt;
    }

    return overwrites;

};
