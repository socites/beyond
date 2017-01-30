module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, language, template) {
        "use strict";

        let processors = require('path').join(require('main.lib'), 'types/processors');
        processors = require(processors)(module);
        let error = require('../error.js')(module);

        let scripts = {};
        let length = 0;

        let styles = require('./styles.js')(template);
        let texts = require('./texts.js')(template);

        for (let processor in config) {

            let files;
            switch (processor) {
                case 'less':
                    scripts[processor] = yield (styles(module, processors, processor, config[processor]));
                    length++;
                    break;

                case 'css':
                    scripts[processor] = yield (styles(module, processors, processor, config[processor]));
                    length++;
                    break;

                case 'txt':
                    scripts[processor] = yield (texts(module, processors, config[processor], language));
                    length++;
                    break;
            }

        }

        let output = '';
        output += (scripts.less) ? scripts.less + '\n\n' : '';
        output += (scripts.css) ? scripts.css + '\n\n' : '';
        output += (scripts.txt) ? scripts.txt + '\n\n' : '';

        // Remove the last two carriage return
        if (length) {
            output = output.substr(0, output.length - 2);
        }

        resolve(output);

    });

};
