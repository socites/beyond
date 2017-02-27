require('colors');

module.exports = require('async')(function *(resolve, reject, modules, specs, path) {
    "use strict";

    if (typeof specs !== 'object') {
        console.log('Invalid applications build configuration'.red);
        resolve();
        return;
    }

    let applications = modules.applications;

    for (let name in specs) {

        console.log('compiling application "'.green + (name).bold.green + '"');

        let application = applications.items[name];
        if (!application) {
            console.log('\tApplication "'.red + (name).red.bold + '" is not registered'.red);
            continue;
        }

        let success = yield require('./application.js')(application, specs[name], path);
        if (!success) {
            continue;
        }

    }

    // write an empty line in the console
    console.log('');

    resolve();

});
