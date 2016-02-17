var async = require('async');

module.exports = function (module, error) {
    "use strict";

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

        let process = require('./process.js');
        styles += (yield process(finder)) + '\n';
        if (overwrites) styles += yield process(overwrites);

        if (!styles) {
            resolve();
            return;
        }

        // clean the css to reduce the size
        styles = new (require('clean-css'))().minify(styles);
        if (styles.errors.length || styles.warnings.length) {

            console.log('check styles on "'.red + (config.path).bold.red + '" for warnings and errors:'.red);
            for (let i in styles.errors) console.log('\tERROR: '.red + (styles.errors[i]).red);
            for (let i in styles.warnings) console.log('\tWARNING: '.yellow + (styles.warnings[i]).yellow);

        }

        styles = styles.styles.replace(/\'/g, '"');

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
