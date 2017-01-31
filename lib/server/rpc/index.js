require('colors');
module.exports = function (modules, specs, runtime) {
    "use strict";

    let context = {
        'namespace': {},
        'connection': {}
    };

    let io;
    try {

        let port = specs.port;
        if (specs.server) io = require('socket.io')(specs.server);
        else io = require('socket.io')(port);

        console.log('ws server listening on port: '.green + (port.toString()).bold);

    }
    catch (exc) {
        console.error('error creating ws server instance'.red.bold + ': ' + exc.message);
        return;
    }

    console.log('\n');

    let applications = modules.applications;
    if (applications.length) console.log('listening applications');
    for (let application of applications.keys) {

        application = applications.items[application];

        console.log('\tlistening application ' + (application.name).bold);
        let ns = application.name;

        (function (application, ns) {

            io.of(ns).on('connection', function (socket) {

                // a separated context to each library
                let nsID = socket.id;

                // context shared by the libraries in the same server
                let connectionID = socket.client.conn.id;

                if (!context.namespace[nsID]) {
                    context.namespace[nsID] = {
                        'socket': socket
                    };
                }

                if (!context.connection[connectionID]) {
                    context.connection[connectionID] = {
                        'socket': socket,
                        'io': io
                    };
                }


                require('./connection.js')(socket, application, runtime, {
                    'connection': context.connection[connectionID],
                    'namespace': context.namespace[nsID]
                });

            });

        })(application, ns);

    }

    if (applications.length) console.log('\n');

    let libraries = modules.libraries;
    if (libraries.length) console.log('listening libraries');
    let namespaces = {};
    for (let library of libraries.keys) {

        library = libraries.items[library];
        if (library.connect) {

            console.log('\tlistening library ' + (library.name).bold);
            let ns = '/libraries/' + library.name;

            (function (library, ns) {

                ns = io.of(ns).on('connection', function (socket) {

                    // a separated context to each library
                    let nsID = socket.id;

                    // context shared by the libraries in the same server
                    let connectionID = socket.client.conn.id;

                    if (!context.namespace[nsID]) {
                        context.namespace[nsID] = {
                            'socket': socket
                        };
                    }

                    if (!context.connection[connectionID]) {
                        context.connection[connectionID] = {
                            'socket': socket,
                            'io': io,
                            'ns': ns
                        };
                    }

                    library.connection(socket, {
                        'connection': context.connection[connectionID],
                        'namespace': context.namespace[nsID]
                    });

                    require('./connection.js')(socket, library, runtime, {
                        'connection': context.connection[connectionID],
                        'namespace': context.namespace[nsID]
                    });

                });

                namespaces[library.name] = ns;

            })(library, ns);

        }

    }
    if (libraries.length) console.log('\n');

    console.log('starting libraries');
    for (let library in namespaces) {

        let ns = namespaces[library];
        library = libraries.items[library];
        library.rpc(ns);

    }

    console.log('\n');

};
