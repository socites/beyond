module.exports = require('async')(function *(resolve, reject, library, json, path, events) {
    "use strict";

    let copy = require('../fs/copy');
    let save = require('../fs/save');

    // Build library service
    if (library.service.code) {

        if (!json.server) {
            json.server = {};
        }

        json.server.service = {};
        json.server.service.path = './service/code';

        let source, destination;

        // copy the service
        source = library.service.path;
        destination = require('path').join(path, 'service/code');
        yield copy.recursive(source, destination);

        // copy the service configuration if it was set
        if (library.service.specs) {

            json.server.service.config = './service/config.json';

            destination = require('path').join(path, 'service/config.json');
            yield save(destination, JSON.stringify(library.service.specs));

        }

    }

    resolve();

});
