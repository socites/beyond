var async = require('async');

module.exports = function (module, error) {
    "use strict";

    let hogan = require('hogan.js');

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

        let html = '';
        for (let i in finder.items) {

            let file = finder.items[i];
            if (file.extname !== '.html') {
                console.log('WARNING: invalid html file extname "'.yellow + (file.file).yellow.bold + '"'.yellow);
                continue;
            }

            let template = yield fs.readFile(file.file, {'encoding': 'utf8'});

            html += template + '\n';

        }

        if (!html) {
            resolve();
            return;
        }

        html = '<template>\n' + html + '</template>\n\n';

        let header = '';
        header += '<!------------\n';
        header += ' HTML TEMPLATE\n';
        header += ' ------------->\n\n';

        resolve(header + html);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'html';
        }
    });

};
