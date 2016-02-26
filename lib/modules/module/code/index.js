var async = require('async');

module.exports = async(function *(resolve, reject, module, config, language, overwrites) {
    "use strict";

    if (!overwrites) overwrites = {};

    let processors = require('./processors')(module);
    let error = require('./error.js')(module);

    let output = '';

    let process = {};
    if (config.css) process.css = config.css;
    if (config.less) process.less = config.less;
    if (config.txt) process.txt = config.txt;
    if (config.html) process.html = config.html;
    if (config.jsx) process.jsx = config.jsx;
    if (config.js) process.js = config.js;

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

        // process the block of the script
        let resource = yield processor.process(process[processorID], language, overwrites[processorID]);

        if (resource) output += resource;
        if (output.substr(output.length - 1) !== '\n') output += '\n';

    }

    resolve(output);

});
