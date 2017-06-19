module.exports = require('async')(function *(resolve, reject, application, languages, specs) {
    "use strict";

    if (!specs) {
        resolve();
        return;
    }

    let fs = require('co-fs');
    let copy = require('../../../fs/copy');

    let pathJS = application.build.js;
    if (specs.mode === 'phonegap') {

        console.log('phonegap mode');
        pathJS = require('path').join(pathJS, 'phonegap');

        // look for the phonegap configuration folders
        let phonegap = require('path').join(application.dirname, 'phonegap');

        // check if destination path exists
        if (!(yield fs.exists(phonegap))) {
            console.error('phonegap directory on application "' + application.name + '" does not exist');
            resolve();
            return;
        }

        // iterate phonegap configuration folders
        let dirs = yield fs.readdir(phonegap);
        for (let i in dirs) {

            let dir = require('path').join(phonegap, dirs[i]);
            let stat = yield fs.stat(dir);

            if (stat.isDirectory()) {
                let path = require('path').join(pathJS, dirs[i]);
                yield require('./languages.js')(application, languages, specs, path);
            }

            for (let language of languages) {
                yield copy.recursive(dir, path);
            }

        }

    }
    else {

        pathJS = require('path').join(pathJS, 'web');
        yield require('./languages.js')(application, languages, specs, pathJS);

    }

    resolve();

});
