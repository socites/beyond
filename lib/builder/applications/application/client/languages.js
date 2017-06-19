module.exports = require('async')(function *(resolve, reject, application, languages, specs, pathJS) {
    "use strict";

    if (!specs) {
        resolve();
        return;
    }

    let fs = require('co-fs');
    let mkdir = require('../../../fs/mkdir');

    for (let language of languages) {

        console.log('\nbuilding language "'.green + (language).bold.green + '"');

        let path = require('path').join(pathJS, language);

        // check if destination path exists
        if (!(yield fs.exists(path))) {
            yield mkdir(path);
        }

        // copy static resources
        yield (require('./statics'))(application, path, language);

        // build config.js and start.js files
        yield (require('./start'))(application, path, language);

        // compile modules
        yield (require('./modules'))(application, path, language);

        // build custom resources
        yield (require('./custom'))(application, path, language);

        // build imported libraries
        yield (require('./libraries'))(application, path, language);

        // compile static overwrites
        yield (require('./overwrites'))(application, path, language);

    }

    resolve();

});
