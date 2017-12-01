module.exports = function (module) {
    "use strict";

    let async = require('async');
    let sep = require('path').sep;

    return async(function *(resolve, reject, files) {

        let hogan = require('hogan.js');
        let fs = require('co-fs');
        let error = require('./error.js')(module, 'mustache');

        let output = '';
        for (let file of files) {

            if (file.extname !== '.html') {
                reject(error('invalid file extension "' + file.relative.name + '"'));
                return;
            }

            let template = yield fs.readFile(file.file, {'encoding': 'utf8'});

            try {
                // compile the template
                template = hogan.compile(template, {'asString': true});
            }
            catch (exc) {
                reject(exc.message);
                return;
            }

            // add the compiled template into the templates array
            let key = file.relative.dirname;
            if (sep !== '/') {
                key = key.replace(new RegExp('\\' + sep, 'g'), '/');
            }
            key = require('url-join')(key, file.basename);
            if (key.substr(0, 2) === './') {
                key = key.substr(2);
            }

            output += 'template = new Hogan.Template(' + template + ');\n';
            output += 'module.templates.register("' + key + '", template);\n';

        }

        let header = '';
        header += '/******************\n';
        header += ' MUSTACHE TEMPLATES\n';
        header += ' ******************/\n\n';

        output = header + output;

        resolve(output);

    });

};
