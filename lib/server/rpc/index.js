var output = require('../../config/output');
module.exports = function (modules, specs, runtime) {
    "use strict";

    let context = {};

    let io;
    try {

        let port = specs.port;
        if (specs.server) io = require('socket.io')(specs.server);
        else io = require('socket.io')(port);

        output.info('ws server listening on port: '+port.toString());

    }
    catch (exc) {
        output.error('error creating ws server instance: '+exc.message);
        return;
    }


    let applications = modules.applications;
    if (applications.length) output.info('listening applications:');
    for (let application of applications.keys) {

        application = applications.items[application];

        output.info('\t\tlistening application ' + (application.name).bold);
        (function (application) {

            let ns = application.name;
            io.of(ns).on('connection', function (socket) {

                if (!context[socket.id]) context[socket.id] = {
                    'socket': socket
                };

                require('./connection.js')(socket, application, runtime, context[socket.id]);

            });

        })(application);

    }


    let libraries = modules.libraries;
    if (libraries.length) output.info('listening libraries:');
    let namespaces = {};
    for (let library of libraries.keys) {

        library = libraries.items[library];
        if (library.connect) {

            output.info('\t\tlistening library ' + library.name);
            (function (library) {

                let ns = '/libraries/' + library.name;
                ns = io.of(ns).on('connection', function (socket) {

                    if (!context[socket.id]) context[socket.id] = {
                        'socket': socket
                    };

                    library.connection(socket, context[socket.id]);
                    require('./connection.js')(socket, library, runtime, context[socket.id]);

                });

                namespaces[library.name] = ns;

            })(library);

        }

    }

    output.info('starting libraries');
    for (let library in namespaces) {

        let ns = namespaces[library];
        library = libraries.items[library];
        library.rpc(ns);

    }


};
