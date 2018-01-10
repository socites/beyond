require('colors');
module.exports = require('async')(function *(resolve, reject, library, file) {
    "use strict";

    file = require('path').resolve(library.dirname, file);

    let fs = require('fs');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {

        let message = 'Library "'.red + (library.name).red.bold +
            '" error, npm configuration not found: "'.red + file.bold + '".'.red;
        console.log(message);
        resolve();
        return;

    }

    let config = fs.readFileSync(file, {'encoding': 'UTF8'});
    try {
        config = JSON.parse(config);
    }
    catch (exc) {

        let message = 'Library npm configuration file "'.red + (file).red.bold + '" is invalid.'.red;
        console.log(message);
        console.log(exc.message);
        resolve();
        return;

    }

    if (typeof config !== 'object') {

        let message = 'Library npm configuration file "'.red + (file).red.bold + '" is invalid.'.red;
        console.log(message);
        resolve();
        return;

    }

    config.dirname = require('path').dirname(file);

    resolve(config);

});
