module.exports = require('async')(function *(resolve, reject, application, languages, specs, runtime, events) {
    "use strict";

    if (!specs) {
        resolve();
        return;
    }

    let fs = require('co-fs');
    let copy = require('../../../fs/copy');

    let appBuildPath = application.build.js;
    if (specs.mode === 'phonegap') {

        events.emit('message', 'phonegap mode');
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

            if (specs.platforms) {

                if (!(specs.platforms instanceof Array)) {
                    events.emit('error', 'Invalid specs.platforms configuration');
                    return;
                }

                if (specs.platforms.indexOf(phonegapConfName) === -1) {
                    continue;
                }

            }

            let phonegapConfDir = require('path').join(phonegapConfsDir, phonegapConfName);

            // Check if phonegap configuration is a directory
            let stat = yield fs.stat(phonegapConfDir);
            if (!stat.isDirectory()) {
                continue;
            }

            // Build creating a package with name of the phonegap configuration folder name
            // Example: applicationBuildPath/android/...
            let appPhonegapBuildPath = require('path').join(appBuildPath, phonegapConfName);
            yield require('./languages.js')(application, languages, specs, appPhonegapBuildPath, events);

            for (let language of languages) {

                let appLanguageBuildPath = require('path').join(appBuildPath, phonegapConfName, language);

                // Copy phonegap configuration files to the built destination
                yield copy.recursive(phonegapConfDir, appLanguageBuildPath);

                // Build phonegap
                if (specs.local) {

                    let childProcess = require('child_process');
                    let cwd = require('path').join(appLanguageBuildPath);

                    let release = (runtime.environment === 'production') ? ' --release' : '';
                    let device = '';
                    if (phonegapConfName === 'ios') {
                        device = ' --device'; // to create the .ipa file
                    }

                    let cmd = 'phonegap build "' + phonegapConfName + '"' + release + device;
                    events.emit('message', 'calling phonegap build, platform "' + phonegapConfName + '"' + release);

                    try {
                        childProcess.execSync(cmd, {'cwd': cwd, 'stdio': [0, 1, 2]});
                    }
                    catch (exc) {
                        if (exc.error) {
                            events.emit('error', 'Error building phonegap "' + phonegapConfName + '"');
                            continue;
                        }
                    }

                    events.emit('message', 'phonegap build, platform "' + phonegapConfName + '" completed');

                    let output;

                    // Copy executable to /output
                    if (phonegapConfName === 'android') {

                        let source = require('path').join(
                            appLanguageBuildPath,
                            'platforms/android/build/outputs/apk/android-debug.apk'
                        );

                        output = require('path').join(process.cwd(), 'output', 'android_debug.apk');
                        yield copy.file(source, output);

                    }

                    events.emit('message', 'output:', output);

                }
                else {

                    yield (require('./archive.js'))(
                        application.name,
                        phonegapConfName,
                        appPhonegapBuildPath,
                        language,
                        events
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
