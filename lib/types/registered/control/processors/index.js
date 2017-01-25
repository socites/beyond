module.exports = require('async')(function *(resolve, reject, module, config, language) {
    "use strict";

    let async = require('async');

    let processors = require('path').join(require('main.lib'), 'types/processors');
    processors = require(processors)(module);
    let error = require('../../../error.js')(module, 'page');

    let scripts = {};
    let length = {'styles': 0, 'code': 0};

    for (let processor in config) {

        let files, styles;
        switch (processor) {
            case 'less':
                styles = require('./styles.js');
                scripts[processor] = yield (styles(module, processors, 'less', config[processor]));
                length.styles++;
                break;

            case 'css':
                styles = require('./styles.js');
                scripts[processor] = yield (styles(module, processors, 'css', config[processor]));
                length.styles++;
                break;

            case 'txt':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files, language);
                length.code++;
                break;

            case 'html':
            case 'mustache':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files);
                length.code++;
                break;

            case 'jsx':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files);
                length.code++;
                break;

            case 'js':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files);
                length.code++;
                break;
        }

    }

    let output = {'styles': '', 'code': ''};
    output.styles += (scripts.less) ? scripts.less + '\n\n' : '';
    output.styles += (scripts.css) ? scripts.css + '\n\n' : '';

    // Remove the last two carriage return
    if (length.styles) {
        output.styles = output.styles.substr(0, output.styles.length - 2);
    }

    output.code += (scripts.txt) ? scripts.txt + '\n\n' : '';
    output.code += (scripts.mustache) ? scripts.mustache + '\n\n' : '';
    output.code += (scripts.jsx) ? scripts.jsx + '\n\n' : '';
    output.code += (scripts.js) ? scripts.js + '\n\n' : '';

    // Remove the last two carriage return
    if (length.code) {
        output.code = output.code.substr(0, output.code.length - 2);
    }

    resolve(output);

});
