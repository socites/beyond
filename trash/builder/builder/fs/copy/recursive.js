// recursively copy all files of a directory
module.exports = require('async')(function *(resolve, reject, source, target) {
    "use strict";

    let async = require('async');
    let mkdir = require('../mkdir');
    let copyFile = require('./file.js');
    let fs = require('co-fs');

    let copy = async(function *(resolve, reject, source, target) {

        if ((yield fs.stat(source)).isFile()) {

            yield copyFile(source, target);
            resolve();
            return;

        }

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
