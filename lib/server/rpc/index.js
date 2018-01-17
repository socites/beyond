require('colors');
module.exports = function (modules, specs, runtime) {
    "use strict";

    let context = {};

    let io;
    try {

        let port = specs.port;
        let options = {
            serveClient: false,
            maxHttpBufferSize: 5000
        };

        if (specs.server) io = require('socket.io')(specs.server, options);
        else io = require('socket.io')(port, options);

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

        if (!application.connect) {
            continue;
        }

        console.log('\tlistening application ' + (application.name).bold);
        let ns = '/' + application.name;

        (function (application, ns) {

            io.of(ns).on('connection', function (socket) {

                // id shared by all libraries in the same server
                // let shared = socket.client.conn.id;

                context[socket.id] = {
                    'socket': socket,
                    'io': io,
                    'ns': ns
                };

                socket.on('disconnect', function () {
                    delete context[socket.id];
                });

                require('./connection.js')(application, runtime, context[socket.id]);

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

                    // id shared by all libraries in the same server
                    // let shared = socket.client.conn.id;

                    context[socket.id] = {
                        'socket': socket,
                        'io': io,
                        'ns': ns
                    };

                    library.connection(context[socket.id]);

                    require('./connection.js')(library, runtime, context[socket.id]);

                    socket.on('disconnect', function () {
                        try {
                            library.disconnect(context[socket.id]);
                        }
                        catch (exc) {
                            console.log(exc.stack);
                        }
                        delete context[socket.id];
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
