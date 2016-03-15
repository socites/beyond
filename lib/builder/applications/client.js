// compile config.js and start.js
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    let save = require('../fs/save');

    let target, resource;

    console.log('\tbuiling config.js and start.js'.green);

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
