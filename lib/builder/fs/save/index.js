module.exports = require('async')(function *(resolve, reject, file, content) {
    "use strict";

    let mkdir = require('../mkdir');
    let fs = require('co-fs');

    yield mkdir(require('path').dirname(file));

    // delete destination file if exists
    let exists = yield fs.exists(file);
    if (exists) {

        // check if it is a file
        let stat = yield fs.stat(file);
        if (!stat.isFile()) throw new Error('destination path is not a file: "' + file + '"');

        // delete the file
        yield fs.unlink(file);

    }

    // create the file
    let handler = yield fs.open(file, 'w');
    yield fs.close(handler);

    // save the content
    yield fs.appendFile(file, content);

    resolve();

});
