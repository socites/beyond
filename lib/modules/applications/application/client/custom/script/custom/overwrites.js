module.exports = function (overwrites, moduleID) {
    "use strict";

    let Finder = require('finder');

    // take out the 'libraries/' from the moduleID ('libraries/'.length === 10)
    overwrites = overwrites.items[moduleID.substr(10)];

    if (!overwrites || !overwrites.custom) {
        return {};
    }
    overwrites = overwrites.custom;

    let dirname = overwrites.dirname;

    overwrites = {
        'less': (typeof overwrites.less === 'string') ? [overwrites.less] : overwrites.less,
        'css': (typeof overwrites.css === 'string') ? [overwrites.css] : overwrites.css,
        'txt': (typeof overwrites.txt === 'string') ? [overwrites.txt] : overwrites.txt
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
