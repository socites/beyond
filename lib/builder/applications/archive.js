var async = require('async');

module.exports = async(function * (resolve, reject, appname, path, destination) {
    "use strict";

    if (!destination) {
        resolve();
        return;
    }

    destination = require('path').join(path, destination);

    let file_system = require('fs');
    let archiver = require('archiver');

    let output = file_system.createWriteStream(destination);
    let archive = archiver('zip');

    output.on('close', function () {
        console.log('\n');
        console.log('Application "' + appname + '" has been archived.');
        console.log('\t' + archive.pointer() + ' total bytes');
        console.log('\n');
    });

    archive.on('error', function (err) {
        reject(err);
        return;
    });

    archive.pipe(output);
    archive.bulk([
        {
            'expand': true,
            'cwd': path,
            'src': ['**/*'],
            'dot': true
        }
    ]);
    archive.finalize();

    resolve();

});
