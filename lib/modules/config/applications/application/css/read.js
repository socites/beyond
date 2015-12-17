var async = require('async');
var output = require('../../../../../config/output');

module.exports = async(function *(resolve, reject, application, file) {
    "use strict";

    file = require('path').resolve(application.dirname, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        let message = 'overwrites configuration of application "'.red +
            (application.name).red.bold + '" error, file not found: '.red + file.bold;

        console.log(message);
        resolve();
        return;

    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {
                
        output.error('custom "'+file+'" is invalid on application "'+application.name+'"');
        output.error(exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        output.error('custom "'+file+'" is invalid on application "'+application.name+'"');
        resolve();
        return;

    }

    resolve(config);

});
