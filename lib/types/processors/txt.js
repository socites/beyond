module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files, language) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'txt');

        function merge(o1, o2) {
            for (let prop in o2) {
                if (typeof o1[prop] === 'object' && typeof o2[prop] === 'object') {
                    merge(o1[prop], o2[prop]);
                }
                else {
                    o1[prop] = o2[prop];
                }
            }
            return o1;
        }

        let output = {};
        for (let key in files) {

            let file = files[key];

            if (file.extname !== '.json') {
                reject(error('invalid file extension "' + file.relative.name + '"'));
                return;
            }

            let t = yield fs.readFile(file.file, {'encoding': 'utf8'});

            try {
                t = JSON.parse(t);
            }
            catch (exc) {
                reject(error(exc.message));
                return;
            }

            if (typeof t !== 'object') {
                reject(error('texts file is not an object'));
                return;
            }

            merge(output, t);

        }

        if (!output) {
            resolve();
            return;
        }

        if (language) {
            output = output[language];
        }
        if (!output) {
            resolve();
            return;
        }

        output =
            '/************\n' +
            ' Module texts\n' +
            ' ************/\n\n' +

            'var texts = JSON.parse(\'' + JSON.stringify(output) + '\');\n' +
            'if(!module.texts) module.texts = {};\n' +
            '$.extend(module.texts, texts);' +
            '\n\n';

        resolve(output);

    });

};
