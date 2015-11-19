module.exports = require('async')(function *(resolve, reject, modules, languages, source) {
    "use strict";

    source = (typeof source === 'string' && source === 'source');

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

                if (source) libraryJson.versions[version.version] = {
                    'build': {'hosts': version.build.hosts}
                };

                if (version.start && source)
                    libraryJson.versions[version.version].start = version.start;

                // create the module.json file
                let moduleJson = {};

                console.log('\tbuiling module '.green + (key).bold.green)

                // building start script
                if (module.start && source) {

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

                    let script = yield module.code();
                    let path = version.build.js;

                    // check if destination path exists
                    if (!(yield fs.exists(path)))
                        yield mkdir(path);

                    if (source) {

                        moduleJson.code = {'js': {'files': ['code.js']}};
                        let target = require('path').join(path, key, 'code.js');
                        yield save(target, script.content);

                    }
                    else {

                        let name = (key === '.') ? 'main.js' : key + '.js';

                        let target = require('path').join(path, name);
                        yield save(target, script.content);

                    }

                }

                // copying static resources
                if (module.static) {

                    moduleJson.static = module.static.config;

                    yield module.static.process();
                    for (let path of module.static.keys) {

                        let resource = module.static.items[path];

                        if (resource.content) {

                            let target = require('path').join(
                                version.build.js,
                                resource.relative.file);

                            yield save(target, resource.content);

                        }
                        else {

                            let target = require('path').join(
                                version.build.js,
                                resource.relative.file);

                            yield copy.file(resource.file, target);

                        }

                    }

                }

                // build server actions, backend and config
                let server = module.server.config;
                if (server && server.actions) {

                    let path = version.build.ws;
                    moduleJson.server = {'actions': './actions'};

                    // copy actions source code
                    let source = require('path').join(module.dirname, server.actions);
                    let destination = require('path').join(path, module.path, 'actions');
                    yield copy.recursive(source, destination);

                    // copy backend source code
                    if (server.backend) {
                        moduleJson.server.backend = './backend';
                        let source = require('path').join(module.dirname, server.backend);
                        let destination = require('path').join(path, module.path, 'backend');
                        yield copy.recursive(source, destination);
                    }

                    // copy module configuration
                    if (server.config) {
                        moduleJson.server.config = './config.json';
                        let source = require('path').join(module.dirname, server.config);
                        let destination = require('path').join(path, module.path, 'config.json');
                        yield copy.file(source, destination);
                    }

                    // save module.json
                    let target = require('path').join(path, module.path, 'module.json');
                    yield save(target, JSON.stringify(moduleJson));

                }

                // saving module.json file
                if (source) {

                    let target = require('path').join(
                        version.build.js,
                        key,
                        'module.json');

                    yield save(target, JSON.stringify(moduleJson));

                }

            }

            // saving library.json file
            if (source) {

                let target = require('path').join(
                    library.build.js,
                    'library.json');

                yield save(target, JSON.stringify(libraryJson));

            }

        }

        console.log('');

    }

    resolve();

});
