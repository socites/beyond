/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config, error) {
    "use strict";

    Object.defineProperty(this, 'multilanguage', {
        'get': function () {
            return false;
        }
    });

    Object.defineProperty(this, 'extname', {
        'get': function () {
            return '.html';
        }
    });

    let scope = function (icons) {

        // add an extra tab in all lines
        icons = icons.replace(/\n/g, '\n    ');
        icons = '    ' + icons + '\n';

        // add script inside its own function
        let output = '';
        let name = 'name="' + config.name + '" ';
        let size = 'size="' + ((config.size) ? config.size : '24') + '"';

        output += '<iron-iconset-svg ' + name + size + '>\n';
        output += '<svg><defs>\n\n';
        output += icons;
        output += '</defs></svg>\n';
        output += '</iron-iconset-svg>\n';

        return output;

    };

    this.start = require('./start.js')(module, config, error);

    let async = require('async');

    this.process = async(function *(resolve, reject, language) {

        if (!config.name || !config.id || !config.files) {
            reject(error('Icons must define an "id", a "name" and a "files" property'));
            return;
        }

        let process = require('path').join(require('main.lib'), 'types/process');
        process = require(process);

        let script = yield process({
            'module': module,
            'type': 'icons',
            'config': {'html': {'files': config.files}},
            'supports': ['html'],
            'language': language
        });

        let output = scope(script);
        resolve(output);

    });

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.id = config.id;
        json.name = config.name;
        json.size = config.size;

        resolve();

    });

};
