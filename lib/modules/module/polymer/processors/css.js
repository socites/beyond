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
            if (file.extname !== '.css') {
                console.log('WARNING: invalid css file extname "'.yellow + (file.file).yellow.bold + '"'.yellow);
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
        header += '/***************\n';
        header += ' TEMPLATE STYLES\n';
        header += ' ***************/\n\n';

        let output = header + '<style>\n' + css + '</style>\n\n';

        resolve(output);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'html';
        }
    });

};
