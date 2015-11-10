var async = require('async');

require('colors');
module.exports = async(function *(resolve, reject, application, root, moduleID, file) {
    "use strict";

    file = require('path').resolve(root, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        let message = 'overwrites configuration of application "'.red +
            (application.name).red.bold + '" error, ' +
            'on module "'.red + (moduleID).red.bold + '" extension file not found: '.red + file.bold;

        console.log(message);
        resolve();
        return;

    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {

        let message = 'custom "'.red + (file).red.bold +
            '" is invalid on application "'.red + (application.name).red.bold + '"'.red;

        console.log(message);
        console.log(exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        let message = 'custom "'.red + (file).red.bold +
            '" is invalid on application "'.red + (application.name).red.bold + '"'.red;

        console.log(message);
        resolve();
        return;

    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
