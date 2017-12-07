module.exports = require('async')(function *(resolve, reject, specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;

    let files = yield (finder(module, type, 'js', config));

    let fs = require('co-fs');

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

