var async = require('async');

module.exports = function (module, error) {
    "use strict";

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

        let script = '';
        for (let i in finder.items) {

            let file = finder.items[i];

            let content = yield fs.readFile(file.file, {'encoding': 'utf8'});

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

            output += content;
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
