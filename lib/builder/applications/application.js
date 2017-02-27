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

        console.log('compiling language "'.green + (language).bold.green + '"');

        let pathJS = require('path').join(application.build.js, language);
        let pathWS = require('path').join(application.build.ws, application.version);

        // check if destination path exists
        if (!(yield fs.exists(pathJS))) yield mkdir(pathJS);
        if (application.connect && !(yield fs.exists(pathWS))) yield mkdir(pathWS);

        // compile static resources
        yield (require('./statics.js'))(application, pathJS, pathWS, language);

    }

    resolve();

});
