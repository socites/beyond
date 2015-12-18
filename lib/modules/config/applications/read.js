var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
module.exports = async(function *(resolve, reject, path, file) {
    "use strict";

    file = require('path').resolve(path, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        yaol.error(yaolMessenger,'applications configuration file not found: '+file);
        resolve();
        return;
    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {
        yaol.error(yaolMessenger,'applications configuration file "'+file+'" is invalid');
        yaol.error(exc.message);
        resolve();
        return;
    }

    if (typeof config !== 'object') {
        yaol.error(yaolMessenger,'applications file not found: '+file);
        resolve();
        return;
    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
