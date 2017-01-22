var async = require('async');

module.exports = function (module, error) {
    "use strict";

    let hogan = require('hogan.js');

    this.process = async(function *(resolve, reject, config) {

        if (typeof config !== 'object') {
            reject(error('invalid processor configuration'));
            return;
        }
        if (typeof config.files !== 'object') {
            reject(error('invalid configuration on processor "html", files property must be specified'.red));
            return;
        }

        let fs = require('co-fs');

        let path = module.dirname;
        if (config.path) path = require('path').join(path, config.path);

        let Finder = require('finder');
        let finder = new Finder(path, {'list': config.files, 'usekey': 'relative.file'});
        yield finder.process();

        let code = '';
        for (let i in finder.items) {

            let file = finder.items[i];
            if (file.extname !== '.html') {
                console.log('WARNING: invalid html file extname "'.yellow + (file.file).yellow.bold + '"'.yellow);
                continue;
            }

            let template = yield fs.readFile(file.file, {'encoding': 'utf8'});

            try {
                // compile the template
                template = hogan.compile(template, {asString: true});
            }
            catch (exc) {
                throw error.message('error compiling html template: "' + file + '"');
            }

            // add the compiled template into the templates array
            let key = require('url-join')(file.relative.dirname, file.basename);
            if (key.substr(0, 2) === './') key = key.substr(2);

            code += 'template = new Hogan.Template(' + template + ');\n';
            code += 'module.templates.register("' + key + '", template);\n';

        }

        if (!code) {
            resolve();
            return;
        }

        code += '\n\n';

        let header = '';
        header += '/**************\n';
        header += ' HTML TEMPLATES\n';
        header += ' **************/\n\n';
        header += 'var template;\n\n';

        resolve(header + code);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'html';
        }
    });

};
