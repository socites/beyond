module.exports = require('async')(function *(resolve, reject, module, language, path) {
    "use strict";

    if (!module.static) {
        resolve();
        return;
    }

    let save = require('../../../../fs/save');
    let copy = require('../../../../fs/copy');

    yield module.static.process();
    for (let path of module.static.keys) {

        let resource = module.static.items[path];

        let target = require('path').join(
            path,
            module.path,
            'static',
            resource.relative.file);

        if (resource.content) {
            yield save(target, resource.content);
        }
        else {
            yield copy.file(resource.file, target);
        }

    }

    resolve();

});
