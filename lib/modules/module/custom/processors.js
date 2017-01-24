var async = require('async');

module.exports = async(function *(resolve, reject, module, config, language, template) {
    "use strict";

    let processors = require('path').join(require('main.lib'), 'types/processors');
    processors = require(processors)(module);
    let error = require('../error.js')(module);

    let output = '';

    let process = {};
    if (config.css) {
        process['script-css'] = config.css;
    }
    if (config.less) {
        process['script-less'] = config.less;
    }
    if (config.txt) {
        process['script-txt'] = config.txt;
    }
    if (config.html) {
        process['script-html'] = config.html;
    }
    if (config.jsx) {
        process['script-jsx'] = config.jsx;
    }
    if (config.js) {
        process['script-js'] = config.js;
    }

    for (let processorID in process) {

        if (typeof process[processorID] !== 'object' || !process[processorID]) {
            reject(error('configuration is not defined'));
            return;
        }

        let processor = processors[processorID];
        if (!processor) {
            reject(error('processor "' + processorID + '" does not exist'));
            return;
        }

        let overwrites = template.overwrites[module.ID];
        overwrites = (typeof overwrites === 'object') ? overwrites[processorID] : undefined;

        // process the block of the script
        let resource = yield processor.process(
            process[processorID],
            language,
            template);

        if (resource) output += resource;
        if (output.substr(output.length - 1) !== '\n') output += '\n';

    }

    resolve(output);

});
