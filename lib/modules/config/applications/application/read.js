var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
module.exports = async(function *(resolve, reject, name, path, file) {
    "use strict";

    file = require('path').resolve(path, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        yaol.error(yaolMessenger,'application "'+name+'" error, file not found: '+file);
        resolve();
        return;
    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {
        yaol.error(yaolMessenger,'application configuration file "'+file+'" is invalid');
        yaol.error(yaolMessenger,exc.message);
        resolve();
        return;
    }

    if (typeof config !== 'object') {
        yaol.error(yaolMessenger,'application configuration file "'+file+'" is invalid');
        resolve();
        return;
    }

    config.dirname = require('path').dirname(file);

    resolve(config);

}, this);
