// compile config.js and start.js
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    let save = require('../fs/save');

    if (application.build.client && application.build.client.path) {

        let path = application.build.client.path;
        if (!path) path = '';
        pathJS = require('path').join(pathJS, path);

    }

    console.log('\tbuiling config.js and start.js'.green);

    let target, resource;

    // compile config.js
    resource = yield application.client.script('config.js', language);
    target = require('path').join(pathJS, 'config.js');
    yield save(target, resource.content);

    // compile start.js
    resource = yield application.client.script('start.js', language);
    target = require('path').join(pathJS, 'start.js');
    yield save(target, resource.content);

    resolve();

});
