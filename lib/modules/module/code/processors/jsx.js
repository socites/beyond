var async = require('async');

module.exports = function (module, error) {
    "use strict";

    var babel = require('babel-core');

    this.process = async(function *(resolve, reject, config) {

        if (typeof config !== 'object') {
            reject(error('invalid processor configuration'));
            return;
        }
        if (typeof config.files !== 'object') {
            reject(error('invalid configuration on processor "js", files property must be specified'.red));
            return;
        }

        let fs = require('co-fs');

        let path = module.dirname;
        if (config.path) path = require('path').join(path, config.path);

        let Finder = require('finder');
        let finder = new Finder(path, {'list': config.files, 'usekey': 'relative.file'});

        try {
            yield finder.process();
        }
        catch (exc) {
            reject(error(exc.message));
        }

        var wrap = function (code) {

            // add an extra tab in all lines
            code = 'return ' + code;
            code = code.replace(/\n/g, '\n    ');
            code = '    ' + code + '\n';
            code += '\n';

            // add script inside its own function
            let output = '';
            output += 'function () {\n\n';
            output += code;
            output += '};';

            return output;

        };

        let script = 'var react;\n\n';
        for (let i in finder.items) {

            let file = finder.items[i];

            let content = yield fs.readFile(file.file, {'encoding': 'utf8'});

            // compile it
            var code = babel.transform(content, {
                presets: ["react"]
            });

            let header = '';
            header += ' FILE NAME: ';
            header += require('path').join(file.relative.dirname, file.filename);

            let output = '';
            output += '/';
            output += (new Array(header.length).join('*'));
            output += '\n' + header;
            output += '\n ';
            output += (new Array(header.length).join('*'));
            output += '/\n\n';

            let key = require('url-join')(file.relative.dirname, file.basename);
            if (key.substr(0, 2) === './') key = key.substr(2);

            output += 'react = ' + wrap(code.code) + '\n\n';
            output += 'module.react.register(\'' + key + '\', react);';

            if (i !== finder.length - 1) {
                output += '\n\n';
            }
            script += output;

        }

        resolve(script);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'js';
        }
    });

};
