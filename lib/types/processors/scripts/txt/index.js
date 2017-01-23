var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config, language, overwrites) {

        if (typeof config !== 'object') {
            reject(error('invalid processor configuration'));
            return;
        }
        if (typeof config.files !== 'object') {
            reject(error('invalid configuration on processor "txt", files property must be specified'.red));
            return;
        }

        let path = module.dirname;
        if (config.path) path = require('path').join(path, config.path);

        let texts = {};

        let Finder = require('finder');
        let finder = new Finder(path, {'list': config.files, 'usekey': 'relative.file'});

        let process = require('./process.js');
        yield process(texts, finder, language);
        if (overwrites) {
            yield process(texts, overwrites, language);
        }

        if (!texts) {
            resolve({});
            return;
        }

        let script =
            '/************\n' +
            ' MODULE TEXTS\n' +
            ' ************/\n\n' +

            'var texts = JSON.parse(\'' + JSON.stringify(texts) + '\');\n' +
            'if(!module.texts) module.texts = {};\n' +
            '$.extend(module.texts, texts);' +
            '\n\n';

        resolve(script);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'txt';
        }
    });

};
