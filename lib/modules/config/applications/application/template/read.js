require('colors');
module.exports = require('async')(function *(resolve, reject, application, file) {
    "use strict";

    file = require('path').resolve(application.dirname, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        let message = 'Invalid template configuration on application "'.red +
            (application.name).red.bold + '" error, file not found: "'.red + file.bold + '".'.red;

        console.log(message);
        resolve();
        return;

    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {

        let message = 'Template configuration file "'.red + (file).red.bold +
            '" is invalid on application "'.red + (application.name).red.bold + '".'.red;

        console.log(message);
        console.log(exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        let message = 'Template configuration "'.red + (file).red.bold +
            '" is invalid on application "'.red + (application.name).red.bold + '".'.red;

        console.log(message);
        resolve();
        return;

    }

    config.dirname = require('path').dirname(file);

    resolve(config);

}, this);
