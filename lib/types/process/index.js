module.exports = require('async')(function *(resolve, reject, module, type, config, supports, language) {
    "use strict";

    let processors = require('../').processors;

    let scripts = {};
    let length = 0;

    let files = require('./files');

    for (let processor in config) {

        let pError = require('./error.js')(module, 'code', processor);
        let minify = false;

        if (supports.indexOf(processor) === -1) {
            continue;
        }

        if (!processors.has(processor)) {
            // It is a configuration block of the type, but not a processor
            reject(pError('Processor "' + processor + '" is not installed'));
            continue;
        }

        let process = processors.get(processor);
        scripts[processor] = yield process(module, 'code', config[processor], files, minify, pError);
        length++;

    }

    let output = '';
    for (var processor of supports) {
        output += (scripts[processor]) ? scripts[processor] + '\n\n' : '';
    }

    // Remove the last two carriage return
    if (length) {
        output = output.substr(0, output.length - 2);
    }

    resolve(output);

});
