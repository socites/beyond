require('colors');
module.exports = require('async')(function *(resolve, reject, path, file) {
    "use strict";

    file = require('path').resolve(path, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        let message = 'Configuration file not found: '.red + (file).red.bold;
        console.log(message);
        return;
    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {
        let message = 'Configuration configuration file "'.red + (file).red.bold + '" is invalid.'.red;
        console.log(message);
        console.log(exc.message);
        resolve();
        return;
    }

    if (typeof config !== 'object') {
        let message = 'Configuration configuration file "'.red + (file).red.bold + '" is invalid.'.red;
        console.log(message);
        resolve();
        return;
    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
