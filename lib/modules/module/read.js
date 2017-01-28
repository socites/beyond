module.exports = require('async')(function *(resolve, reject, file) {
    "use strict";

    let fs = require('co-fs');
    if (!(yield fs.exists(file)) || !(yield fs.stat(file)).isFile()) {
        reject(new Error('module configuration not found: ' + file));
        return;
    }

    let config;
    try {

        config = yield fs.readFile(file, {'encoding': 'UTF8'});
        config = JSON.parse(config);

    }
    catch (exc) {
        let message = 'module configuration file "' + file + '" is invalid: ' + exc.message;
        reject(new Error(message));
        return;
    }

    if (typeof config !== 'object') {
        reject(new Error('invalid module configuration file "' + file + '"'));
        return;
    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
