// compile application customs
module.exports = require('async')(function *(resolve, reject, application, path, language, events) {
    "use strict";

    let save = require('../../../../fs/save');

    if (application.build.custom && application.build.custom.path) {

        let pathJS = application.build.custom.path;
        if (!pathJS) pathJS = '';
        path = require('path').join(path, pathJS);

    }

    events.emit('message', 'builing custom code');

    let libraries = application.libraries;
    for (let library of libraries.keys) {

        library = libraries.items[library];
        let modules = library.modules;

        yield modules.process();

        for (let module of modules.keys) {

            module = modules.items[module];
            yield module.initialise();

            if (module.custom) {

                let custom = yield application.client.custom.script(library.name, module.path, language);

                let target = module.path;
                if (target === '.') target = 'main';

                target = require('path').join(path, 'custom', library.name, target + '.js');
                yield save(target, custom.content);

            }

        }

    }

    resolve();

});
