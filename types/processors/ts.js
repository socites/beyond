module.exports = require('async')(function* (resolve, reject, specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;

    let files = yield (finder(module, type, 'ts', config));

    let sep = require('path').sep;

    let fs = require('co-fs');

    const babel = require('babel-core');

    let source = '';

    for (let key in files) {

        if (!files.hasOwnProperty(key)) continue;

        let file = files[key];
        if (file.extname !== '.ts') {
            reject(error(`Invalid file extension "${file.relative.file}"`));
            return;
        }

        source += '/';
        source += (new Array(file.relative.file.length).join('*'));
        source += `\n${file.relative.file}\n`;
        source += `${new Array(file.relative.file.length).join('*')}`;
        source += '/\n\n';

        source += yield fs.readFile(file.file, {'encoding': 'utf8'});
        source += '\n\n';

    }

    // Compile source code
    let code;
    try {
        code = babel.transform(source, {
            presets: ['react']
        });
    }
    catch (exc) {
        reject(error(`Error compiling typescript processor:\n${exc.message}`));
    }

    resolve(`${code.code}\n\n`);

});
