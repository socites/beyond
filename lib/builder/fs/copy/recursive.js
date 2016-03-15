var async = require('async');

// recursively copy all files of a directory
module.exports = async(function *(resolve, reject, source, target) {
    "use strict";

    let mkdir = require('../mkdir');
    let copyFile = require('./file.js');
    let fs = require('co-fs');

    let copy = async(function *(resolve, reject, source, target) {

        let files = yield fs.readdir(source);
        for (let i in files) {

            let from = require('path').join(source, files[i]);
            let to = require('path').join(target, files[i]);

            let stat = yield fs.stat(from);

            if (stat.isDirectory()) {
                yield copy(from, to);
            }
            else if (stat.isFile()) {

                yield mkdir(target);
                yield copyFile(from, to);

            }

        }

        resolve();

    });

    yield copy(source, target);
    resolve();

});
