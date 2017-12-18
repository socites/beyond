module.exports = require('async')(function *(resolve, reject, module, language, pathJS, events) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../../../../../fs/mkdir');
    let save = require('../../../../../fs/save');

    let library = module.library;

    let path = require('path').join(
        pathJS,
        'libraries',
        library.name);

    // check if destination path exists
    if (!(yield fs.exists(path))) {
        yield mkdir(path);
    }

    for (let name in module.types) {

        let type = module.types[name];
        let multilanguage = type.multilanguage;
        events.emit('message', 'building type ' + name);

        if (multilanguage) {

            let file = language + type.extname;
            let resource = yield type.process(language);

            let target = (module.path === '.') ? 'main' : module.path;
            target = require('path').join(path, target, name);

            // check if destination path exists
            if (!(yield fs.exists(target))) {
                yield mkdir(target);
            }

            target = require('path').join(target, file);
            yield save(target, resource.content);

        }
        else {

            let file = name + type.extname;
            let resource = yield type.process();

            let target = (module.path === '.') ? 'main' : module.path;
            target = require('path').join(path, target);

            // check if destination path exists
            if (!(yield fs.exists(target))) {
                yield mkdir(target);
            }

            target = require('path').join(target, file);
            yield save(target, resource.content);

        }

    }

    resolve();

});
