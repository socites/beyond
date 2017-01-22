require('colors');

module.exports = require('async')(function *(resolve, reject, version, language, specs) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../fs/mkdir');
    let save = require('../fs/save');
    let copy = require('../fs/copy');

    // build server actions, backend and config
    let server = module.server.config;
    if (server && server.actions && specs.server) {

        let path = version.build.ws;
        moduleJson.ws.server = {'actions': './actions'};

        // copy actions source code
        let source = require('path').join(module.dirname, server.actions);
        let destination = require('path').join(path, module.path, 'actions');
        yield copy.recursive(source, destination);

        // copy backend source code
        if (server.backend) {
            moduleJson.ws.server.backend = './backend';
            let source = require('path').join(module.dirname, server.backend);
            let destination = require('path').join(path, module.path, 'backend');
            yield copy.recursive(source, destination);
        }

        // copy module configuration
        if (server.config) {
            moduleJson.ws.server.config = './config.json';
            let source = require('path').join(module.dirname, server.config);
            let destination = require('path').join(path, module.path, 'config.json');
            yield copy.file(source, destination);
        }

        // save module.json
        let target = require('path').join(path, module.path, 'module.json');
        yield save(target, JSON.stringify(moduleJson.ws));

    }

});
