module.exports = require('async')(function *(resolve, reject, module, json, path) {
    "use strict";

    if (!module.static) {
        resolve();
        return;
    }

    let copy = require('../../../../fs/copy');

    // Copy static resources
    json.static = module.static.config;

    yield module.static.process();
    for (let key of module.static.keys) {

        let resource = module.static.items[key];

        let target = (module.path === '.') ? 'main' : module.path;
        target = require('path').join(
            path,
            target,
            resource.relative.file);

        yield copy.file(resource.file, target);

    }

    resolve();

});
