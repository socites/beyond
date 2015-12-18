var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
module.exports = async(function *(resolve, reject, application, file) {
    "use strict";

    file = require('path').resolve(application.dirname, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        yaol.error(yaolMessenger,'invalid css values on application "'+application.name+'" error, file not found: '+file);
        resolve();
        return;

    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {

        yaol.error(yaolMessenger,'css values "'+file+'" are invalid on application "'+application.name+'"');
        yaol.error(yaolMessenger,exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        yaol.error(yaolMessenger,'css values "'+file+'" are invalid on application "'+application.name+'"');
        resolve();
        return;

    }

    config.dirname = require('path').dirname(file);

    resolve(config);

}, this);
