require('colors');

module.exports = require('async')(function *(resolve, reject, module, json, path) {
    "use strict";

    if (!module.config.custom) {
        resolve();
        return;
    }

    let copy = require('../../../../fs/copy');

    json.custom = module.config.custom;

    let processors = module.config.custom;
    for (let name in processors) {

        let processor = processors[name];
        let files = (typeof processor === 'string') ? [processor] : processor.files;
        files = (typeof files === 'string') ? [files] : files;

        if (!(files instanceof Array)) {
            continue;
        }

        // Check if wildcard is in the list
        let wildcard;
        for (let file of files) {
            if (file === '*') {
                wildcard = true;
                break;
            }
        }

        // If wildcard is present, then copy all files
        if (wildcard) {

            let source = require('path').join(
                module.dirname,
                (processor.path) ? processor.path : './');

            let target = (module.path === '.') ? 'main' : module.path;
            target = require('path').join(
                path,
                target,
                (processor.path) ? processor.path : './');

            yield copy.recursive(source, target);

            continue;

        }

        for (let file of files) {

            let source = require('path').join(
                module.dirname,
                (processor.path) ? processor.path : './',
                file);

            let target = (module.path === '.') ? 'main' : module.path;
            target = require('path').join(
                path,
                target,
                (processor.path) ? processor.path : './',
                file);

            yield copy.recursive(source, target);

        }

    }

    resolve();

});
