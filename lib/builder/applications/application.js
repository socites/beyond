module.exports = require('async')(function *(resolve, reject, application, specs, path) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../fs/mkdir');

    let modules = application.modules;
    yield modules.process();

    let languages = specs.languages;
    if (typeof languages === 'string') {
        languages = [languages];
    }
    if (!(languages instanceof Array) || !languages.length) {
        languages = ['eng', 'spa'];
    }

    for (let language of languages) {

        console.log('building language "'.green + (language).bold.green + '"');

        let pathJS = require('path').join(application.build.js, language);
        let pathWS = require('path').join(application.build.ws, application.version);

        // check if destination path exists
        if (!(yield fs.exists(pathJS))) yield mkdir(pathJS);
        if (application.connect && !(yield fs.exists(pathWS))) yield mkdir(pathWS);

        // copy static resources
        yield (require('./statics.js'))(application, pathJS, pathWS, language);

        // build config.js and start.js files
        yield (require('./client.js'))(application, pathJS, pathWS, language);

        // compile modules
        // yield (require('./modules'))(application, pathJS, pathWS, language);

        // build custom resources
        // yield (require('./custom.js'))(application, pathJS, pathWS, language);

        // build imported libraries
        yield (require('./libraries'))(application, pathJS, pathWS, language);

        // compile static overwrites
        // yield (require('./overwrites.js'))(application, pathJS, pathWS, language);

    }

    resolve();

});
