require('colors');
module.exports = function (core, specs, runtime) {
    'use strict';

    let io;
    try {

        let port = specs.port;
        let options = {
            serveClient: false,
            maxHttpBufferSize: 5000
        };

        io = require('socket.io')((specs.server) ? specs.server : port, options);

        console.log(`WS server listening on port: ${port}`.green);

    }
    catch (exc) {
        console.error('Error creating ws server instance'.red.bold);
        console.error(exc.message);
        return;
    }

    console.log('\n');

    require('./applications.js')(io, core.applications);
    require('./libraries.js')(io, core.libraries);

};
