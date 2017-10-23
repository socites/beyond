// compile application modules
require('colors');
module.exports = require('async')(function *(resolve, reject, application, specs) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../../../fs/mkdir');

    if (!application.connect || !specs) {
        resolve();
        return;
    }

    console.log('\tbuiling application modules'.green);

    let pathWS = require('path').join(application.build.ws, application.version);
    if (!(yield fs.exists(pathWS))) {
        yield mkdir(pathWS);
    }

    for (let key of modules.keys) {

        let module = modules.items[key];
        yield module.initialise();

        console.log('\t\tbuiling module '.green + (key).bold.green);

        yield require('./server.js')(module, pathWS);

    }

    resolve();

});
