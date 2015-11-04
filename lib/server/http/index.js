require('colors');
module.exports = function (port, modules, specs) {
    "use strict";

    let server;
    try {

        let listener = require('./listener.js')(modules, specs);

        server = require('http').createServer(listener);
        server.listen(port);

        console.log('http server listening on port: '.green + (port.toString()).bold);

    }
    catch (exc) {
        console.error('error creating http server instance'.red.bold + ': ' + exc.message);
        return;
    }

    return server;

};
