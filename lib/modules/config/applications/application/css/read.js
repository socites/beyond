var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
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
                
        yaol.error(yaolMessenger,'custom "'+file+'" is invalid on application "'+application.name+'"');
        yaol.error(yaolMessenger,exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        yaol.error(yaolMessenger,'custom "'+file+'" is invalid on application "'+application.name+'"');
        resolve();
        return;

    }

    resolve(config);

});
