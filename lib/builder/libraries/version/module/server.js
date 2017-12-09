require('colors');

module.exports = require('async')(function *(resolve, reject, module, specs, pathWS, events) {
    "use strict";

    let fs = require('co-fs');
    let save = require('../../../fs/save');
    let copy = require('../../../fs/copy');

    let config = module.server.config;

    // build server actions, backend and config
    if (config && specs.server) {

        let json = {'server': {}};

        let source, destination;

        // copy actions source code
        if (config.actions) {

            json.server.actions = './actions';

            source = require('path').join(module.dirname, config.actions);
            destination = require('path').join(pathWS, module.path, 'actions');
            yield copy.recursive(source, destination);

        }

        // copy module configuration
        if (config.config) {

            json.server.config = './config.json';

            source = require('path').join(module.dirname, config.config);
            destination = require('path').join(pathWS, module.path, 'config.json');
            yield copy.file(source, destination);

        }

        // save module.json
        let target = require('path').join(pathWS, module.path, 'module.json');
        yield save(target, JSON.stringify(json));

    }

    resolve();

});
