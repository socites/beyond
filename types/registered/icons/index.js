/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config, error) {
    "use strict";

    let async = require('async');
    let processors = require('path').join(require('main.lib'), 'types/processors');
    processors = require(processors)(module);
    error = error(module, 'control');

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

        let imports = [];
        if (module.application) {
            let host = module.application.hosts(false).libraries.vendor.js;
            host += 'static/bower_components/';
            imports.push(host + 'iron-icon/iron-icon.html');
            imports.push(host + 'iron-iconset-svg/iron-iconset-svg.html');
        }

        // add script inside its own function
        let output = '';
        let name = 'name="' + config.name + '" ';
        let size = 'size="' + ((config.size) ? config.size : '24') + '"';

        for (let i in imports) {
            output += '<link rel="import" href="' + imports[i] + '">\n';
        }

        output += '<iron-iconset-svg ' + name + size + '>\n';
        output += '<svg><defs>\n\n';
        output += icons;
        output += '</defs></svg>\n';
        output += '</iron-iconset-svg>\n';

        return output;

    };

    this.start = require('./start.js')(module, config);

    this.process = async(function *(resolve, reject) {

        if (!config.name || !config.id || !config.files) {
            reject(error('Icons must define an "id", a "name" and a "files" property'));
            return;
        }

        let files = yield (require('../files.js')(module, 'icons', config));
        let code = yield processors.html(files);
        code = scope(code);

        resolve(code);

    });

    this.setBuildConfig = async(function *(resolve, reject, json) {

        json.id = config.id;
        json.name = config.name;
        json.size = config.size;

        resolve();

    });

};
