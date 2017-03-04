module.exports = require('async')(function *(resolve, reject, library, json) {
    "use strict";

    // Build library service
    if (library.service.code) {

        json.server.ws.service = {};
        json.server.ws.service.path = './service/code';

        let source, destination;

        // copy the service
        source = library.service.path;
        destination = require('path').join(library.build.ws, 'service/code');
        yield copy.recursive(source, destination);

        // copy the service configuration if it was set
        if (library.service.specs) {

            json.server.ws.service.config = './service/config.json';

            destination = require('path').join(library.build.ws, 'service/config.json');
            yield save(destination, JSON.stringify(library.service.specs));

        }

    }

});
