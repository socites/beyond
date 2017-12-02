module.exports = require('async')(function *(resolve, reject, module, config, language, finder, error) {
    "use strict";

    let supports = ['less', 'css', 'txt', 'html', 'jsx', 'js'];

    let types = require('path').join(require('main.lib'), 'types');
    let processors = require(types).processors;

    let scripts = {};
    let length = 0;

    for (let processor in config) {

        let pError = error(module, 'code', processor);
        let minify = false;

        if (supports.indexOf(processor) === -1) {
            continue;
        }

        if (!processors.has(processor)) {
            // It is a configuration block of the type, but not a processor
            reject(pError('Processor "' + processor + '" is not installed'));
            continue;
        }

        let cfg = config[processor];
        processor = (processor === 'html') ? processor = 'mustache' : processor;

        let process = processors.get(processor);
        scripts[processor] = yield process(module, 'code', cfg, finder, minify, pError);
        length++;

    }

    let output = '';
    for (var processor of supports) {
        processor = (processor === 'html') ? processor = 'mustache' : processor;
        output += (scripts[processor]) ? scripts[processor] + '\n\n' : '';
    }

    // Remove the last two carriage return
    if (length) {
        output = output.substr(0, output.length - 2);
    }

    resolve(output);

});
