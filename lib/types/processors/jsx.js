module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'jsx');

        let babel = require('babel-core');
        let react = require('path').resolve(require('main.lib'), '../node_modules/babel-preset-react');

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

        for (let file of files) {

            if (file.extname !== '.jsx') {
                reject(error('invalid file extension "' + file.relative.file + '"'));
                return;
            }

            let content = yield fs.readFile(file.file, {'encoding': 'utf8'});

            // compile it
            let code = babel.transform(content, {
                presets: [react]
            });

            let key = require('url-join')(file.relative.dirname, file.basename);
            if (key.substr(0, 2) === './') {
                key = key.substr(2);
            }

            let header = '';
            header += '/';
            header += (new Array(file.relative.file.length + 1).join('*'));
            header += '\n ' + file.relative.file + '\n';
            header += ' ' + (new Array(file.relative.file.length + 1).join('*'));
            header += '/\n\n';

            output += header;
            output += 'create = ' + wrapper(code.code) + '\n\n';
            output += 'module.react.register(\'' + key + '\', create);\n\n';

        }

        resolve(output);

    });

};
