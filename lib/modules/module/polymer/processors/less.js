var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config) {

        if (typeof config !== 'object') {
            reject(error('invalid processor configuration'));
            return;
        }
        if (typeof config.files !== 'object') {
            reject(error('invalid configuration on processor "html", files property must be specified'.red));
            return;
        }

        let fs = require('co-fs');

        let path = module.dirname;
        if (config.path) path = require('path').join(path, config.path);

        let Finder = require('finder');
        let finder = new Finder(path, {'list': config.files, 'usekey': 'relative.file'});
        yield finder.process();

        let css = '';
        for (let i in finder.items) {

            let file = finder.items[i];
            if (file.extname !== '.less') {
                console.log('WARNING: invalid less file extname "'.yellow + (file.file).yellow.bold + '"'.yellow);
                continue;
            }

            let stylesheet = yield fs.readFile(file.file, {'encoding': 'utf8'});

            css += stylesheet + '\n';

        }

        if (!css) {
            resolve();
            return;
        }

        let header = '';
        header += '/**********************\n';
        header += ' TEMPLATE STYLES (LESS) \n';
        header += ' **********************/\n\n';

        let less = require('less');
        less.render(css, {'compress': false}, function (e, output) {

            if (e) {
                reject(error('error compiling less: "' + e.message + '"'));
                return;
            }

            output = header + '<style>\n' + output.css + '</style>\n\n';
            resolve(output);

        });

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'html';
        }
    });

};
