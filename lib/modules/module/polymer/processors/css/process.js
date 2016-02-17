var async = require('async');

require('colors');
module.exports = async(function *(resolve, reject, finder) {
    "use strict";

    let fs = require('co-fs');

    yield finder.process();

    let styles = '';
    for (let key in finder.items) {

        let file = finder.items[key];

        if (file.extname !== '.css') {
            console.log('WARNING: invalid css file extname "'.yellow + (file.file).yellow.bold + '"'.yellow);
            continue;
        }
        styles += yield fs.readFile(file.file, {'encoding': 'utf8'});

    }

    resolve(styles);

});
