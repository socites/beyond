var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
module.exports = async(function *(resolve, reject, application, root, moduleID, file) {
    "use strict";

    file = require('path').resolve(root, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        yaol.error(yaolMessenger,'overwrites configuration of application "'+application.name+'on module "'+moduleID+'" extensions file not found: '+file);
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

    config.dirname = require('path').dirname(file);

    resolve(config);

});
