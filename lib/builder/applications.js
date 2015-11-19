module.exports = require('async')(function *(resolve, reject, modules, languages) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('./mkdir.js');
    let save = require('./save.js');
    let copy = require('./copy');

    for (let language of languages) {

        let applications = modules.applications;
        for (let name of applications.keys) {

            console.log('compiling application '.green + (name).bold.green);
            let application = applications.items[name];
            let modules = application.modules;
            yield modules.process();

            if (!modules.keys.length) {
                console.log('\tno modules found on application: ' + application.name);
                continue;
            }

            let pathJS = require('path').join(application.build.js, language);
            let pathWS = application.build.ws;
            // check if destination path exists
            if (!(yield fs.exists(pathJS))) yield mkdir(pathJS);
            if (!(yield fs.exists(pathWS))) yield mkdir(pathWS);

            // compile application static resources
            yield application.static.process(language);
            for (let key of application.static.keys) {

                let file = application.static.items[key];
                let target = require('path').join(pathJS, key);
                yield save(target, file.content);

            }

            let target, resource;

            // compile config.js
            resource = yield application.client.script('config.js', language);
            target = require('path').join(pathJS, 'config.js');
            yield save(target, resource.content);

            // compile start.js
            resource = yield application.client.script('start.js', language);
            target = require('path').join(pathJS, 'start.js');
            yield save(target, resource.content);


            // compile modules
            for (let key of modules.keys) {

                let module = modules.items[key];
                yield module.initialise();

                console.log('\tbuiling module '.green + (key).bold.green)

                // building code script
                if (module.code) {

                    let script = yield module.code(language);
                    let target = require('path').join(pathJS, module.path + '.js');
                    yield save(target, script.content);

                }

                // build server actions, backend and config
                let server = module.server.config;
                if (server && server.actions) {

                    let json = {'server': {'actions': './actions'}};

                    // copy actions source code
                    let source = require('path').join(module.dirname, server.actions);
                    let destination = require('path').join(pathWS, module.path, 'actions');
                    yield copy.recursive(source, destination);

                    // copy backend source code
                    if (server.backend) {
                        json.server.backend = './backend';
                        let source = require('path').join(module.dirname, server.backend);
                        let destination = require('path').join(pathWS, module.path, 'backend');
                        yield copy.recursive(source, destination);
                    }

                    // copy module configuration
                    if (server.config) {
                        json.server.config = './config.json';
                        let source = require('path').join(module.dirname, server.config);
                        let destination = require('path').join(pathWS, module.path, 'config.json');
                        yield copy.file(source, destination);
                    }

                    // save module.json
                    let target = require('path').join(pathWS, module.path, 'module.json');
                    yield save(target, JSON.stringify(json));

                }

                // copying static resources
                if (module.static) {

                    yield module.static.process();
                    for (let path of module.static.keys) {

                        let resource = module.static.items[path];
                        let target = require('path').join(
                            path,
                            resource.relative.file);

                        yield copy.file(resource.file, target);

                    }

                }

            }

            // compile customs
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

                        target = require('path').join(pathJS, 'custom', library.name, target + '.js');
                        yield save(target, custom.content);

                    }

                }

            }


            // compile static overwrites
            yield application.overwrites.initialise();
            for (let module of application.overwrites.keys) {

                let overwrites = application.overwrites.items[module];
                if (!overwrites.static) continue;

                module = module.split('/');
                let library = module.shift();
                module = module.join('/');
                if (!module) module = 'main';

                for (let resource of overwrites.static.keys) {

                    let overwrite = overwrites.static.items[resource];

                    resource = yield application.client.custom.static(library, module, resource);
                    let target = require('path').join(pathJS, 'custom', library, module, 'static', overwrite);

                    copy.file(resource.file, target);

                }

            }

        }

    }

    console.log('');
    resolve();

});
