module.exports = require('async')(function *(resolve, reject, modules, languages) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../fs/mkdir');

    for (let language of languages) {

        let applications = modules.applications;
        for (let name of applications.keys) {

            console.log('compiling application '.green + (name).bold.green);
            let application = applications.items[name];
            let modules = application.modules;
            yield modules.process();

            let pathJS = require('path').join(application.build.js, language);
            let pathWS = require('path').join(application.build.ws, application.version);

            // check if destination path exists
            if (!(yield fs.exists(pathJS))) yield mkdir(pathJS);
            if (application.connect && !(yield fs.exists(pathWS))) yield mkdir(pathWS);

            // compile static resources
            yield (require('./statics.js'))(application, pathJS, pathWS, language);

            // compile config.js and start.js
            yield (require('./client.js'))(application, pathJS, pathWS, language);

            // compile modules
            yield (require('./modules.js'))(application, pathJS, pathWS, language);

            // compile custom
            yield (require('./custom.js'))(application, pathJS, pathWS, language);

            // compile static overwrites
            yield (require('./overwrites.js'))(application, pathJS, pathWS, language);

            // compile libraries
            yield (require('./libraries.js'))(application, pathJS, pathWS, language);

            yield (require('./archive.js'))(pathJS, application.build.archive);

        }

    }

    console.log('');
    resolve();

});
