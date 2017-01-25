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

        for (let processor in config) {

            let files, styles;
            switch (processor) {
                case 'less':
                    styles = require('./styles.js');
                    scripts[processor] = yield (styles(module, processors, 'less', config[processor]));
                    length++;
                    break;

                case 'css':
                    styles = require('./styles.js');
                    scripts[processor] = yield (styles(module, processors, 'css', config[processor]));
                    length++;
                    break;

                case 'txt':
                    files = yield (require('./files.js')(module, processor, config[processor]));
                    scripts[processor] = yield processors[processor](files, language);
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
