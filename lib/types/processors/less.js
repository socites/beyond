module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files, compress) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'less');

        let output = '';
        for (let key in files) {

            let file = files[key];

            if (file.extname !== '.css') {
                reject(error('invalid file extension "' + file.relative.file + '"'));
                return;
            }

            output += yield fs.readFile(file.file, {'encoding': 'utf8'});

        }

        if (!output) {
            resolve();
            return;
        }

        // Compile less
        let less = require('less');
        less.render(output, {'compress': compress}, function (e, processed) {

            if (e) {
                reject(error(e.message));
                return;
            }

            output = processed.css;

        });

        // replace all ' to "
        output = output.replace(/\'/g, '"');
        resolve(output);

    });

};
