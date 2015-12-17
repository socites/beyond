var async = require('async');
var output = require('../../../../../config/output');

module.exports = async(function *(resolve, reject, finder) {
    "use strict";

    let fs = require('co-fs');

    yield finder.process();

    let styles = '';
    for (let key in finder.items) {

        let file = finder.items[key];

        if (file.extname !== '.css') {
            output.warning('invalid css file extname "'+file.file+'"');
            
            continue;
        }
        styles += yield fs.readFile(file.file, {'encoding': 'utf8'});

    }

    resolve(styles);

});
