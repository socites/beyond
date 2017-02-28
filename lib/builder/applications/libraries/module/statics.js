module.exports = require('async')(function *(resolve, reject, module, pathJS) {
    "use strict";

    if (!module.static) {
        resolve();
        return;
    }

    let save = require('../../../fs/save');
    let copy = require('../../../fs/copy');

    let library = module.library;

    yield module.static.process();
    for (let path of module.static.keys) {

        let resource = module.static.items[path];

        let target = require('path').join(
            pathJS,
            'libraries',
            library.build.path,
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

});
