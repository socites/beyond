module.exports = require('async')(function *(resolve, reject, application, languages, specs) {
    "use strict";

    if (!specs) {
        resolve();
        return;
    }

    let pathJS = application.build.js;
    if (specs.mode === 'phonegap') {

        console.log('phonegap mode');
        pathJS = require('path').join(pathJS, 'phonegap');
        yield require('./languages.js')(application, languages, specs, pathJS);

    }
    else {

        pathJS = require('path').join(pathJS, 'web');
        yield require('./languages.js')(application, languages, specs, pathJS);

    }

    resolve();

});
