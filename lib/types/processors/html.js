module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'html');

        let output = '';
        for (let key in files) {

            let file = files[key];

            if (file.extname !== '.html') {
                reject(error('invalid file extension "' + file.relative.file + '"'));
                return;
            }

            let html = yield fs.readFile(file.file, {'encoding': 'utf8'});
            output += html + '\n\n';

        }

        resolve(output);

    });

};
