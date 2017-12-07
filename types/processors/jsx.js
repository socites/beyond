module.exports = require('async')(function *(resolve, reject, specs) {

    let module = specs.module;
    let type = specs.type;
    let config = specs.config;
    let finder = specs.finder;
    let minify = specs.minify;
    let error = specs.error;

    let files = yield (finder(module, type, 'jsx', config));

    let sep = require('path').sep;

    function toCamel(value) {
        return value.replace(/-([a-z])/g, function (m, w) {
            return w.toUpperCase();
        });
    }

    let fs = require('co-fs');

    let babel = require('babel-core');
    let react = require('path').resolve(require('main.lib'), '../node_modules/babel-preset-react');
    if (!(yield fs.exists(react))) {
        react = require('path').resolve(require('main.lib'), '../../babel-preset-react');
    }

    function wrapper(code) {

        // Indent code
        code = code.replace(/\n/g, '\n    ');
        code = '    ' + code + '\n';
        code += '\n';

        let wrapper = '';
        wrapper += 'function () {\n\n';
        wrapper += '    var React = module.React;\n';
        wrapper += '    var exports;\n\n';
        wrapper += code;
        wrapper += '    return exports;\n\n';
        wrapper += '};';

        return wrapper;

    }

    let output = '';
    output += '/****************\n';
    output += ' REACT COMPONENTS\n';
    output += ' ****************/\n\n';
    output += 'var create;\n\n';

    for (let key in files) {

        let file = files[key];

        if (file.extname !== '.jsx') {
            reject(error('invalid file extension "' + file.relative.file + '"'));
            return;
        }

        let content = yield fs.readFile(file.file, {'encoding': 'utf8'});

        // compile it
        let code;
        try {
            code = babel.transform(content, {
                presets: [react]
            });
        }
        catch (exc) {
            reject(error('error compiling jsx file "' + file.relative.file + '": ' + exc.message));
        }

        let path = file.relative.dirname;
        if (sep !== '/') {
            path = path.replace(new RegExp('\\' + sep, 'g'), '/');
        }
        key = require('url-join')(path, file.basename);
        if (key.substr(0, 2) === './') {
            key = key.substr(2);
        }
        var camelKey = toCamel(key);

        let header = '';
        header += '/';
        header += (new Array(file.relative.file.length).join('*'));
        header += '\n ' + file.relative.file + '\n';
        header += ' ' + (new Array(file.relative.file.length).join('*'));
        header += '/\n\n';

        output += header;
        output += 'create = ' + wrapper(code.code) + '\n\n';
        output += 'module.react.register(\'' + camelKey + '\', create);\n\n';

    }

    resolve(output);

});
