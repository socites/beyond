var async = require('async');

var fs = require('fs');
var preset = require('path').resolve(__dirname,
    '../../../../../../../babel-preset-react');

if (!fs.existsSync(preset)) {
    preset = require('path').resolve(__dirname,
        '../../../../../../node_modules/babel-preset-react');
}

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
            let output = '';
            output += 'var React = module.React;\n';
            output += 'var exports;\n\n';
            output += code;
            output += '\n\n';
            output += 'return exports;';

            output = output.replace(/\n/g, '\n    ');
            output = '    ' + output + '\n';
            output += '\n';

            // add script inside its own function
            code = output;

            output = '';
            output += 'function () {\n\n';
            output += code;
            output += '};';

            return output;

        };

        let script = 'var jsxExportFnc;\n\n';
        for (let i in finder.items) {

            let file = finder.items[i];

            let content = yield fs.readFile(file.file, {'encoding': 'utf8'});

            // compile it
            var code = babel.transform(content, {
                presets: [preset]
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

            output += 'jsxExportFnc = ' + wrap(code.code) + '\n\n';
            output += 'module.react.register(\'' + key + '\', jsxExportFnc);';

            if (i !== finder.length - 1) {
                output += '\n\n';
            }
            script += output;

        }

        let output = '';

        // add an extra tab in all lines of the script
        script = script.replace(/\n/g, '\n    ');
        script = '    ' + script + '\n';

        output += '<script>\n';
        output += '(function (params) {\n\n';
        output += '    var done = params[1];\n';
        output += '    var module = params[0];\n';
        output += '    var dependencies = module.dependencies.modules;\n';
        output += '    var react = module.react.items;\n\n';
        output += script;
        output += '})(beyond.modules.get(\'' + module.ID + '\'));\n';
        output += '</script>\n\n';

        resolve(output);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'js';
        }
    });

};
