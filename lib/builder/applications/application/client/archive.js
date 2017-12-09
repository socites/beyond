module.exports = require('async')(function * (resolve, reject, appname, phonegapConf, path, language, events) {
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
        events.emit('message',
            'Application "' + appname + '", ' +
            'phonegap configuration "' + phonegapConf + '", ' +
            'language "' + language +
            '" has been archived.');

        events.emit('message', '\t' + archive.pointer() + ' total bytes');
        resolve();
    });

    archive.on('error', function (err) {
        events.emit('error', err);
        reject(err);
        return;
    });

    archive.pipe(output);

    let sep = require('path').sep;
    archive.directory(source + sep);

    archive.finalize();

});
