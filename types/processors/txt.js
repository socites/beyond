module.exports = require('async')(function *(resolve, reject, specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;
    let language = specs.language;
    let template = specs.template;

    let files = [];

    // Add the files of the module
    files = files.concat(yield (finder(module, type, 'txt', config)));

    if (template) {
        files = files.concat(yield template.getCustomOverwrites(module, 'txt', error));
    }

    let fs = require('co-fs');

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
    for (let file of files) {

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
