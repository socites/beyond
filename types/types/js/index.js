/**
 * Compiles js
 */
module.exports = function (module, config, error) {
    'use strict';

    let async = require('async');

    Object.defineProperty(this, 'multilanguage', {'get': () => false});
    Object.defineProperty(this, 'extname', {'get': () => '.js'});

    // Add script inside its own function
    let scope = function (code, standalone) {
        code = code.replace(/\n/g, '\n    '); // Add an extra tab in all lines
        code = `    ${code}\n`;
        return `(function () {\n\n${code}})();`;
    };

    this.process = async(function* (resolve, reject, language) {

        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        let script = yield process({
            'module': module,
            'type': 'code',
            'config': config,
            'supports': ['js'],
            'language': language
        });

        script = scope(script, config.standalone);
        resolve(script);

    });

    this.setBuildConfig = async(function* (resolve, reject, json) {
        json.id = config.id;
        json.dependencies = config.dependencies;
        resolve();
    });

};
