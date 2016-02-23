module.exports = require('async')(function *(resolve, reject, modules, languages, opts, buildPath) {
    "use strict";

    if (typeof opts !== 'object') opts = {'code': true};
    if (typeof opts.specs === 'undefined') opts.specs = {'js': true, 'ws': true};
    if (typeof opts.specs === 'boolean') opts.specs = {'js': opts.specs, 'ws': opts.specs};

    let fs = require('co-fs');
    let mkdir = require('./mkdir.js');
    let save = require('./save.js');
    let copy = require('./copy');

    let libraries = modules.libraries;
    let librariesJson = {'js': {}, 'ws': {}};

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

            let libraryJson = {
                'js': {'versions': {}},
                'ws': {'versions': {}}
            };

            for (let key of version.modules.keys) {

                let module = version.modules.items[key];
                yield module.initialise();

                libraryJson.js.versions[version.version] = {
                    'build': {'hosts': version.build.hosts}
                };

                libraryJson.ws.versions[version.version] = {};

                if (version.start && opts.start)
                    libraryJson.js.versions[version.version].start = version.start;

                // create the module.json file
                let moduleJson = {};

                console.log('\tbuiling module '.green + (key).bold.green);

                // building start script
                if (module.start && opts.start) {

                    moduleJson.start = {'js': {'files': ['start.js']}};

                    let script = yield module.start();

                    // check if destination path exists
                    let path = version.build.js;
                    if (!(yield fs.exists(path)))
                        yield mkdir(path);

                    let target;
                    if (opts.specs.js) {

                        target = require('path').join(path, key, 'start.js');

                    }
                    else {

                        let name = (key === '.') ? 'main.js' : key + '.js';
                        target = require('path').join(path, 'start', name);

                    }

                    yield save(target, script.content);

                }

                // building code script
                if (module.code && opts.code) {

                    let script = yield module.code();
                    let path = version.build.js;

                    // check if destination path exists
                    if (!(yield fs.exists(path)))
                        yield mkdir(path);

                    moduleJson.code = {'js': {'files': ['code.js']}};

                    if (opts.specs.js) {

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
                if (module.static && opts.static) {

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
                if (server && server.actions && opts.ws) {

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
                if (opts.specs.js) {

                    let target = require('path').join(
                        version.build.js,
                        key,
                        'module.json');

                    yield save(target, JSON.stringify(moduleJson));

                }

            }

            // saving library.json file
            if (opts.specs.js) {

                librariesJson.js[library.name] = require('path').join(library.build.path, 'library.json');

                let target;
                target = require('path').join(
                    library.build.js,
                    'library.json');

                yield save(target, JSON.stringify(libraryJson.js));

            }

            if (opts.specs.ws && library.connect) {

                librariesJson.ws[library.name] = require('path').join(library.build.path, 'library.json');

                let target = require('path').join(
                    library.build.ws,
                    'library.json');

                yield save(target, JSON.stringify(libraryJson.ws));

            }

        }

        let target;

        target = require('path').join(
            buildPath,
            'libraries/js',
            'libraries.json');

        yield save(target, JSON.stringify(librariesJson.js));

        target = require('path').join(
            buildPath,
            'libraries/ws',
            'libraries.json');

        yield save(target, JSON.stringify(librariesJson.ws));

        // write an empty line in the console
        console.log('');

    }

    resolve();

});
