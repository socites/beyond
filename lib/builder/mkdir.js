var async = require('async');

module.exports = async(function *(resolve, reject, path) {
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

        yield fs.mkdir(path);

    }

    resolve();

});
