module.exports = require('async')(function *(resolve, reject, module, type, config, finder, minify, error) {

    let files = yield (finder(module, type, 'html', config));

    let fs = require('co-fs');

    let output = '';
    let length = 0;
    for (let file of files) {

        if (file.extname !== '.html') {
            reject(error('invalid file extension "' + file.relative.file + '"'));
            return;
        }

        let html = yield fs.readFile(file.file, {'encoding': 'utf8'});
        output += html + '\n\n';
        length++;

    }

    if (length) {
        output = output.substr(0, output.length - 2);
    }

    resolve(output);

});
