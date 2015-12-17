var output = require('../../config/output');

module.exports = function (port, modules, specs) {
    "use strict";

    let server;
    try {

        let listener = require('./listener.js')(modules, specs);

        server = require('http').createServer(listener);
        server.listen(port);

        output.info('http server listening on port: '+ port.toString());

    }
    catch (exc) {
        output.error('error creating http server instance: '+exc.message);
        return;
    }

    return server;

};
