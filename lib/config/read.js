require('colors');
module.exports = require('async')(function *(resolve, reject, file) {
    "use strict";

    file = require('path').resolve(process.cwd(), file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        let message = 'configuration file not found: '.red + file.bold;
        console.log(message);
        return;
    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {
        let message = 'configuration file "'.red + (file).red.bold + '" is invalid'.red;
        console.log(message);
        console.log(exc.message);
        return;
    }

    if (typeof config !== 'object') {
        let message = 'configuration file "'.red + (file).red.bold + '" is invalid'.red;
        console.log(message);
        return;
    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
