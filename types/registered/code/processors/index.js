module.exports = require('async')(function *(resolve, reject, module, config, language, finder, error) {
    "use strict";

    let async = require('async');

    let types = require('path').join(require('main.lib'), 'types');
    let processors = require(types).processors;

    let scripts = {};
    let length = 0;

    let template = (module.application) ? module.application.template : undefined;
    let styles = require('./styles.js')(template);

    for (let processor in config) {

        let files;
        let pError = error(module, 'code', processor);
        let minify = false;

        if (!processors.has(processor)) {
            // It is a configuration block of the type, but not a processor
            continue;
        }
        let process = processors.get(processor);

        switch (processor) {
            case 'less':
                scripts[processor] = yield (styles(module, processor, process, config[processor], finder, minify, pError));
                length++;
                break;

            case 'css':
                scripts[processor] = yield (styles(module, processor, process, config[processor], finder, minify, pError));
                length++;
                break;

            case 'txt':
                files = yield (finder(module, 'code', processor, config[processor]));
                scripts[processor] = yield process(module, files, minify, pError, language);
                length++;
                break;

            case 'html':
            case 'mustache':
                files = yield (finder(module, 'code', processor, config[processor]));
                scripts.mustache = yield process(module, files, minify, pError);
                length++;
                break;

            case 'jsx':
                files = yield (finder(module, 'code', processor, config[processor]));
                scripts[processor] = yield process(module, files, minify, pError);
                length++;
                break;

            case 'js':
                files = yield (finder(module, 'code', processor, config[processor]));
                scripts[processor] = yield process(module, files, minify, pError);
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
