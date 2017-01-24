module.exports = require('async')(function *(resolve, reject, module, config, language) {
    "use strict";

    let async = require('async');

    let processors = require('../../../processors')(module);
    let error = require('../../../error.js')(module, 'page');

    let scripts = {};
    let length = 0;
    let available = ['less', 'css', 'txt', 'mustache', 'jsx', 'js'];

    for (let processor in config) {

        processor = (processor === 'html') ? 'mustache' : processor;
        if (available.indexOf(processor) === -1) {
            continue;
        }

        length++;
        let files = yield (require('../../files.js')(module, processor, config[processor]));
        scripts[processor] = yield processors[processor](files, language);

    }

    let output = '';
    output += (scripts.less) ? scripts.less + '\n\n' : '';
    output += (scripts.css) ? scripts.css + '\n\n' : '';
    output += (scripts.txt) ? scripts.txt + '\n\n' : '';
    output += (scripts.mustache) ? scripts.mustache + '\n\n' : '';
    output += (scripts.jsx) ? scripts.jsx + '\n\n' : '';
    output += (scripts.js) ? scripts.js + '\n\n' : '';

    // Remove the last two carriage return
    if (length) {
        output = output.substr(0, output.length - 2);
    }

    resolve(output);

});
