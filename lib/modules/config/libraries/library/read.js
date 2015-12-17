var async = require('async');
var output = require('../../../../config/output');

module.exports = async(function *(resolve, reject, name, path, file) {
    "use strict";

    file = require('path').resolve(path, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        output.error('library "'+name+'" error, file not found: '+file);
        resolve();
        return;

    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {

        output.error('library configuration file "'+file+'" is invalid');
        output.error(exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        output.error('library configuration file "'+file+'" is invalid');
        resolve();
        return;

    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
