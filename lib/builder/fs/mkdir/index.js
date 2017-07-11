require('colors');
module.exports = require('async')(function *(resolve, reject, path) {
    "use strict";

    let fs = require('co-fs');

    let exists = yield fs.exists(path);
    if (exists) {
        resolve();
        return;
    }

    let sep = require('path').sep;
    let folders = path.split(sep);

    if (sep === '\\') {
        path = folders.shift();
    }
    else {
        path = '/';
    }

    for (let i in folders) {

        path = require('path').join(path, folders[i]);

        let exists = yield fs.exists(path);
        if (exists) continue;

        try {
            yield fs.mkdir(path);
        }
        catch (exc) {
            // If errno is -17, the directory already exists, avoid to show an error
            if (exc.errno !== -17) {
                console.log(exc.errno, exc);
            }
        }

    }

    resolve();

});
