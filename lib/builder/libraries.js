module.exports = require('async')(function *(resolve, reject, modules, languages) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('./mkdir.js');
    let save = require('./save.js');
    let copy = require('./copy');

    let libraries = modules.libraries;
    for (let name of libraries.keys) {

        console.log('compiling library '.green + (name).bold.green);
        let library = libraries.items[name];
        for (let v of library.versions.keys) {

            console.log('\tcompiling version '.green + (v).bold.green)
            let version = library.versions.items[v];
            yield version.modules.process();

            if (!version.modules.keys.length) {
                console.log('\tno modules found');
                continue;
            }

            let libraryJson = {'versions': {}};
            for (let key of version.modules.keys) {

                let module = version.modules.items[key];
                yield module.initialise();

                libraryJson.versions[version.version] = {
                    'build': {'hosts': version.build.hosts}
                };

                if (version.start) libraryJson.versions[version.version].start = version.start;

                // create the module.json file
                let moduleJson = {};

                console.log('\tbuiling module '.green + (key).bold.green)

                // building start script
                if (module.start) {

                    moduleJson.start = {'js': {'files': ['start.js']}}

                    let script = yield module.start();
                    let path = version.build.js;

                    // check if destination path exists
                    if (!(yield fs.exists(path)))
                        yield mkdir(path);

                    let target = require('path').join(path, key, 'start.js');

                    yield save(target, script.content);

                }

                // building code script
                if (module.code) {

                    moduleJson.code = {'js': {'files': ['code.js']}};

                    let script = yield module.code();
                    let path = version.build.js;

                    // check if destination path exists
                    if (!(yield fs.exists(path)))
                        yield mkdir(path);

                    let target = require('path').join(path, key, 'code.js');

                    yield save(target, script.content);

                }

                // copying static resources
                if (module.static) {

                    moduleJson.static = module.static.config;

                    yield module.static.process();
                    for (let path of module.static.keys) {

                        let resource = module.static.items[path];
                        let target = require('path').join(
                            version.build.js,
                            resource.relative.file);

                        yield copy.file(resource.file, target);

                    }

                }

                // saving module.json file
                let target = require('path').join(
                    version.build.js,
                    key,
                    'module.json');

                yield save(target, JSON.stringify(moduleJson));

            }

            // saving library.json file
            let target = require('path').join(
                library.build.js,
                'library.json');

            yield save(target, JSON.stringify(libraryJson));

        }

        console.log('');

    }

    resolve();

});
