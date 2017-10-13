module.exports = require('async')(function *(resolve, reject, application, languages, specs) {
    "use strict";

    if (!specs) {
        resolve();
        return;
    }

    let fs = require('co-fs');
    let copy = require('../../../fs/copy');

    let appBuildPath = application.build.js;
    if (specs.mode === 'phonegap') {

        console.log('phonegap mode');
        appBuildPath = require('path').join(appBuildPath, 'phonegap');

        // look for the phonegap configuration folders
        let phonegapConfsDir = require('path').join(application.dirname, 'phonegap');

        // check if destination path exists
        if (!(yield fs.exists(phonegapConfsDir))) {
            console.error('phonegap directory on application "' + application.name + '" does not exist');
            resolve();
            return;
        }

        // iterate phonegap configuration folders
        let dirs = yield fs.readdir(phonegapConfsDir);
        for (let i in dirs) {

            let phonegapConfName = dirs[i];
            let phonegapConfDir = require('path').join(phonegapConfsDir, phonegapConfName);

            // Check if phonegap configuration is a directory
            let stat = yield fs.stat(phonegapConfDir);
            if (!stat.isDirectory()) {
                continue;
            }

            // Build creating a package with name of the phonegap configuration folder name
            // Example: applicationBuildPath/android/...
            let appPhonegapBuildPath = require('path').join(appBuildPath, phonegapConfName);
            yield require('./languages.js')(application, languages, specs, appPhonegapBuildPath);

            console.log('');

            for (let language of languages) {

                let appLanguageBuildPath = require('path').join(appBuildPath, phonegapConfName, language);

                // Copy phonegap configuration files to the built destination
                yield copy.recursive(phonegapConfDir, appLanguageBuildPath);

                // Make phonegap build .zip file
                if (!specs.local) {

                    yield (require('./archive.js'))(
                        application.name,
                        phonegapConfName,
                        appPhonegapBuildPath,
                        language
                    );

                }
            }

        }

    }
    else {

        appBuildPath = require('path').join(appBuildPath, 'web');
        yield require('./languages.js')(application, languages, specs, appBuildPath);

    }

    resolve();

});
