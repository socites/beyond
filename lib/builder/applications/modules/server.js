module.exports = require('async')(function *(resolve, reject, module, pathWS) {
    "use strict";

    let save = require('../../fs/save');
    let copy = require('../../fs/copy');

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

});
