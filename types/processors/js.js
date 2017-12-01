module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'js');

        let output = '';
        for (let file of files) {

            if (file.extname !== '.js') {
                reject(error('invalid file extension "' + file.relative.file + '"'));
                return;
            }

            let js = yield fs.readFile(file.file, {'encoding': 'utf8'});

            let header = '';
            header += '/';
            header += (new Array(file.relative.file.length).join('*'));
            header += '\n' + file.relative.file + '\n';
            header += (new Array(file.relative.file.length).join('*'));
            header += '/\n\n';

            output += header + js + '\n\n';

        }

        resolve(output);

    });

};
