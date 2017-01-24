module.exports = function (module) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, files) {

        let fs = require('co-fs');
        let error = require('./error.js')(module, 'jsx');

        let react = require('path').resolve(__dirname, '../../../../../../../babel-preset-react');
        if (yield (fs.exists(react))) {
            react = require('path').resolve(__dirname, '../../../../../../node_modules/babel-preset-react');
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
            wrapper += code + '\n\n';
            wrapper += '    return exports;';
            wrapper += '};';

            return wrapper;

        }

        let output = 'var create;\n\n';
        for (let key in files) {

            let file = files[key];

            if (file.extname !== '.jsx') {
                reject(error('invalid file extension "' + file.relative.file + '"'));
                return;
            }

            output += yield fs.readFile(file.file, {'encoding': 'utf8'});

            key = require('url-join')(file.relative.dirname, file.basename);
            if (key.substr(0, 2) === './') {
                key = key.substr(2);
            }

            output += 'create = ' + wrapper(code.code) + '\n\n';
            output += 'module.react.register(\'' + key + '\', create);';

        }

        resolve(output);

    });

};
