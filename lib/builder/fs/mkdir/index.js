require('colors');
module.exports = require('async')(function *(resolve, reject, path) {
    "use strict";

    let fs = require('co-fs');

    let exists = yield fs.exists(path);
    if (exists) {
        resolve();
        return;
    }

    let folders = path.split('/');
    path = '/';

    for (let i in folders) {

        path = require('path').join(path, folders[i]);

        let exists = yield fs.exists(path);
        if (exists) continue;

        try {
            yield fs.mkdir(path);
        }
        catch (exc) {
            if (exc.errno !== -17) {
                console.log(exc.errno, exc);
            }
            else {
                console.log('Directory already exists');
            }
        }

    }

    resolve();

});
