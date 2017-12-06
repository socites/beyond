module.exports = require('async')(function *(resolve, reject, specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;

    let files = yield (finder(module, type, 'mustache', config));

    let sep = require('path').sep;

    let hogan = require('hogan.js');
    let fs = require('co-fs');

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
