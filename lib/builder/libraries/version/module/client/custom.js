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
        if (!(processor.files instanceof Array)) {
            continue;
        }

        for (let file of processor.files) {

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
