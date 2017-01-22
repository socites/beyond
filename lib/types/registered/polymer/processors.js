var async = require('async');

module.exports = async(function *(resolve, reject, module, config, language) {
    "use strict";

    let processors = require('../../processors')(module);
    let error = require('../../error.js')(module, 'polymer');

    let output = {'dom-module': '', 'dependencies': ''};

    let process = {};
    if (config.dependencies) {
        process['polymer-dependencies'] = config.dependencies;
    }
    if (config.css) {
        process['polymer-css'] = config.css;
    }
    if (config.less) {
        process['polymer-less'] = config.less;
    }
    if (config.txt) {
        process['polymer-txt'] = config.txt;
    }
    if (config.html) {
        process['polymer-html'] = config.html;
    }
    if (config.js) {
        process['polymer-js'] = config.js;
    }
    if (config.jsx) {
        process['polymer-jsx'] = config.jsx;
    }

    for (let processorID in process) {

        if (typeof process[processorID] !== 'object' || !process[processorID]) {
            reject(error('Processor "' + processorID + '" does not exist'));
            return;
        }

        let processor = processors[processorID];
        if (!processor) {
            reject(error('Processor "' + processorID + '" does not exist'));
            return;
        }

        // process the block of the processor
        let resource = yield processor.process(process[processorID], language);
        if (resource) {
            if (processorID === 'dependencies') {
                output.dependencies += resource;
            }
            else {
                output['dom-module'] += resource;

                if (output['dom-module'].substr(output['dom-module'].length - 1) !== '\n')
                    output['dom-module'] += '\n';
            }

        }

    }

    resolve(output);

});
