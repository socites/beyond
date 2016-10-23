var async = require('async');

module.exports = async(function *(resolve, reject, texts, finder, language) {
    "use strict";

    let fs = require('co-fs');

    yield finder.process();

    for (let key in finder.items) {

        let file = finder.items[key];
        if (file.extname !== '.json') {
            console.log('WARNING: invalid json file extname "'.yellow + (file.file).yellow.bold + '"'.yellow);
            continue;
        }

        let t = yield fs.readFile(file.file, {'encoding': 'utf8'});

        try {
            t = JSON.parse(t);
        }
        catch (exc) {

            let message = 'error processing a texts file "'.red + (file).red.bold + '", ' + (exc.message).red;
            console.error(message);
            reject(error(message));
            return;

        }

        if (typeof t !== 'object') {
            reject(error('texts file "'.red + (file).red.bold + '" is not an object'.red));
            return;
        }

        if (language) t = t[language];
        if (!t) continue;

        require('./merge')(texts, t);

    }

    resolve();

});
