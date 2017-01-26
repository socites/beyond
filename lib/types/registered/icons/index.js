/**
 * Returns the script of a "page" type
 */
module.exports = function (module, config) {
    "use strict";

    let async = require('async');
    let processors = require('path').join(require('main.lib'), 'types/processors');
    processors = require(processors)(module);
    let error = require('../../error.js')(module, 'control');

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

    let scope = function (icons, language) {

        // add an extra tab in all lines
        icons = icons.replace(/\n/g, '\n    ');
        icons = '    ' + icons + '\n';

        let imports = [];
        if (module.application) {
            let host = module.application.hosts(language).libraries.vendor.js;
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

    this.process = async(function *(resolve, reject, language) {

        if (!config.name || !config.id || !config.files) {
            reject(error('Icons must define a "id", "name" and "files"'));
            return;
        }

        let files = yield (require('../files.js')(module, 'icons', config));
        let code = yield processors.html(files);
        code = scope(code, language);

        resolve(code);

    });

};
