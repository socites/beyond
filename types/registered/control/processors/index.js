module.exports = require('async')(function *(resolve, reject, module, config, language, error) {
    "use strict";

    let async = require('async');

    let processors = require('path').join(require('main.lib'), 'types/processors');
    processors = require(processors)(module);
    error = error(module, 'page');

    let scripts = {};
    let length = 0;

    let template = (module.application) ? module.application.template : undefined;
    let styles = require('./styles.js')(template);

    for (let processor in config) {

        let files;
        switch (processor) {
            case 'less':
                scripts[processor] = yield (styles(module, processors, 'less', config[processor]));
                length++;
                break;

            case 'css':
                scripts[processor] = yield (styles(module, processors, 'css', config[processor]));
                length++;
                break;

            case 'txt':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files, language);
                length++;
                break;

            case 'html':
            case 'mustache':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files);
                length++;
                break;

            case 'jsx':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files);
                length++;
                break;

            case 'js':
                files = yield (require('../../files.js')(module, processor, config[processor]));
                scripts[processor] = yield processors[processor](files);
                length++;
                break;
        }

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
