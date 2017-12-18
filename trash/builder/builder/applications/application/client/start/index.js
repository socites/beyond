// build config.js and start.js files
module.exports = require('async')(function *(resolve, reject, application, path, language, events) {
    "use strict";

    let save = require('../../../../fs/save');

    if (application.build.client && application.build.client.path) {

        let pathJS = application.build.client.path;
        if (!pathJS) pathJS = '';
        path = require('path').join(path, pathJS);

    }

    events.emit('message', 'builing config.js and start.js files');

    let target, resource;

    // compile config.js
    resource = yield application.client.script('config.js', language);
    target = require('path').join(path, 'config.js');
    yield save(target, resource.content);

    // compile start.js
    resource = yield application.client.script('start.js', language);
    target = require('path').join(path, 'start.js');
    yield save(target, resource.content);

    resolve();

});
