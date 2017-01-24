module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files, minify) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'css');

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

        if (!minify) {
            resolve(output);
            return;
        }

        // Minify css if required
        let cleaned = new (require('clean-css'))().minify(output);
        if (cleaned.errors.length || cleaned.warnings.length) {

            for (let i in cleaned.errors) {
                console.log('\tERROR: '.red + (cleaned.errors[i]).red);
            }
            for (let i in cleaned.warnings) {
                console.log('\tWARNING: '.yellow + (cleaned.warnings[i]).yellow);
            }

            if (cleaned.errors.length) {
                reject(error('check console for warning and errors'));
                return;
            }

        }
        output = cleaned.styles;

        // replace all ' to "
        output = output.replace(/\'/g, '"');
        resolve(output);

    });

};
