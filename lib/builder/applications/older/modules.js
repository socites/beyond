// compile application modules
require('colors');
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    let save = require('../fs/save');
    let copy = require('../fs/copy');

    if (application.build.modules && application.build.modules.path) {

        let path = application.build.modules.path;
        if (!path) path = '';
        pathJS = require('path').join(pathJS, path);

    }

    let modules = application.modules;
    yield modules.process();

    console.log('\tbuiling modules'.green);

    for (let key of modules.keys) {

        let module = modules.items[key];
        yield module.initialise();

        console.log('\t\tbuiling module '.green + (key).bold.green);

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

    resolve();

});
