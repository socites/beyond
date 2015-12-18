var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';
module.exports = function (port, modules, specs) {
    "use strict";

    let server;
    try {

        let listener = require('./listener.js')(modules, specs);

        server = require('http').createServer(listener);
        server.listen(port);

        yaol.info(yaolMessenger,'http server listening on port: '+ port.toString());

    }
    catch (exc) {
        yaol.error(yaolMessenger,'error creating http server instance: '+exc.message);
        return;
    }

    return server;

};
