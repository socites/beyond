require('colors');
module.exports = function (port, modules, specs) {
    'use strict';

    let server;
    try {

        let listener = require('./listener.js')(modules, specs);

        server = require('http').createServer(listener);
        server.listen(port);

        console.log(`HTTP server listening on port: ${port}`.green);

    }
    catch (exc) {
        console.error('Error creating http server instance');
        console.error(exc.stack);
        return;
    }

    return server;

};
