var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config, language) {

        if (typeof config !== 'object') {
            reject(error('invalid processor configuration'));
            return;
        }
        if (typeof config.files !== 'object') {
            reject(error('invalid configuration on processor "css", files property must be specified'.red));
            return;
        }

        let path = module.dirname;
        if (config.path) path = require('path').join(path, config.path);

        let styles = '';

        let Finder = require('finder');
        let finder = new Finder(path, {'list': config.files, 'usekey': 'relative.file'});

        let process = require('./process.js');
        styles += (yield process(finder));

        if (!styles) {
            resolve({});
            return;
        }

        let code = '';
        code += '<style>\n';
        code += styles;
        code += '</style>\n\n';

        let header = '';
        header += '/**********\n';
        header += ' CSS STYLES\n';
        header += ' **********/\n\n';

        resolve(header + code);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'css';
        }
    });

};
