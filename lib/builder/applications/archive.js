var async = require('async');

module.exports = async(function * (resolve, reject, path, destination) {
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
        console.log(archive.pointer() + ' total bytes');
        console.log('Archiver has been finalized and the output file descriptor has closed.');
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
