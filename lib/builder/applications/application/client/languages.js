module.exports = require('async')(function *(resolve, reject, application, languages, specs, pathJS, events) {
    "use strict";

    if (!specs) {
        resolve();
        return;
    }

    let fs = require('co-fs');
    let mkdir = require('../../../fs/mkdir');

    for (let language of languages) {

        events.emit('message', 'building language "' + language + '"');

        let path = require('path').join(pathJS, language);

        // Phonegap Local build requires the files be located inside the the 'www' folder
        path = require('path').join(path, (specs.mode === 'phonegap' && specs.local) ? 'www' : '');

        // check if destination path exists
        if (!(yield fs.exists(path))) {
            yield mkdir(path);
        }

        // copy static resources
        yield (require('./statics'))(application, path, language, events);

        // build config.js and start.js files
        yield (require('./start'))(application, path, language, events);

        // compile modules
        yield (require('./modules'))(application, path, language, events);

        // build custom resources
        yield (require('./custom'))(application, path, language, events);

        // build imported libraries
        yield (require('./libraries'))(application, path, language, events);

        // compile static overwrites
        yield (require('./overwrites'))(application, path, language, events);

    }

    resolve();

});
