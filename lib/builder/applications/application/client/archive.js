module.exports = require('async')(function * (resolve, reject, appname, phonegapConf, path, language) {
    "use strict";

    let source = require('path').join(path, language);
    let destination = source + '.zip';

    let file_system = require('fs');
    let archiver = require('archiver');

    let output = file_system.createWriteStream(destination);
    let archive = archiver('zip', {
        'store': true // Sets the compression method to STORE
    });

    output.on('close', function () {
        console.log(
            'Application "' + appname + '", ' +
            'phonegap configuration "' + phonegapConf + '", ' +
            'language "' + language +
            '" has been archived.');

        console.log('\t' + archive.pointer() + ' total bytes');
        resolve();
    });

    archive.on('error', function (err) {
        console.log('error', err);
        reject(err);
        return;
    });

    archive.pipe(output);

    let sep = require('path').sep;
    archive.directory(source + sep);

    archive.finalize();

});
