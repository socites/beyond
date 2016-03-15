// compile imported libraries
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    if (!application.build.libraries) {
        resolve();
        return;
    }

    let fs = require('co-fs');
    let mkdir = require('../fs/mkdir');
    let save = require('../fs/save');
    let copy = require('../fs/copy');

    let path = application.build.libraries.path;
    if (!path) path = '';
    pathJS = require('path').join(pathJS, path);

    console.log('\tbuiling libraries'.green);

    for (let name of application.libraries.keys) {

        console.log('\t\tbuiling library '.green + (name).green.bold);
        let library = application.libraries.items[name];

        yield library.modules.process();

        if (!library.modules.keys.length) {
            console.log('\t\t\t\tno modules found');
            continue;
        }

        for (let key of library.modules.keys) {

            let module = library.modules.items[key];
            yield module.initialise();

            console.log('\t\t\t\tbuiling module '.green + (key).bold.green);

            // building code script
            if (module.code) {

                let script = yield module.code();

                let path = require('path').join(
                    pathJS,
                    'libraries',
                    library.build.path);

                // check if destination path exists
                if (!(yield fs.exists(path)))
                    yield mkdir(path);

                let name = (key === '.') ? 'main.js' : key + '.js';
                path = require('path').join(path, name);

                yield save(path, script.content);

            }

            // copying static resources
            if (module.static) {

                yield module.static.process();
                for (let path of module.static.keys) {

                    let resource = module.static.items[path];

                    let target = require('path').join(
                        pathJS,
                        'libraries',
                        library.build.path,
                        'static',
                        resource.relative.file);

                    if (resource.content) {
                        yield save(target, resource.content);
                    }
                    else {
                        yield copy.file(resource.file, target);
                    }

                }

            }

        }

    }

    resolve();

});
