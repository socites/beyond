// compile application modules
module.exports = require('async')(function *(resolve, reject, application, specs, events) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../../../fs/mkdir');

    if (!application.connect || !specs) {
        resolve();
        return;
    }

    events.emit('message', 'builing application modules');

    let pathWS = require('path').join(application.build.ws, application.version);
    if (!(yield fs.exists(pathWS))) {
        yield mkdir(pathWS);
    }

    for (let key of modules.keys) {

        let module = modules.items[key];
        yield module.initialise();

        events.emit('message', 'builing module "' + key + '"');

        yield require('./server.js')(module, pathWS, events);

    }

    resolve();

});
