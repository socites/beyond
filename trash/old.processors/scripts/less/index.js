module.exports = function (module, error) {
    "use strict";

    let async = require('async');

    this.process = async(function *(resolve, reject, config, language, overwrites) {

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

        let process = require('./files.js');
        styles += (yield process(finder)) + '\n';

        if (!styles) {
            resolve();
            return;
        }

        // compile less
        styles = (yield (require('./process.js'))(styles, error));

        // replace all ' to "
        styles = styles.replace(/\'/g, '"');

        let is = '';
        if (typeof config.is === 'string') is = config.is;

        // just insert the styles in the script
        let code = '';
        code += '(function() {\n';
        code += '\tvar styles = \'' + styles + '\';\n';
        code += '\tvar is = \'' + is + '\';\n';
        code += '\tmodule.styles.push(styles, is);\n';
        code += '})();\n\n';

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
