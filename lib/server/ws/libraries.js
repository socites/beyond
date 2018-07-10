module.exports = function (io, libraries) {

    if (!libraries.length) {
        return;
    }

    console.log('listening libraries');

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

                    let context = {
                        'socket': socket,
                        'io': io,
                        'ns': ns
                    };

                    library.connection(context);

                    require('./connection.js')(library, runtime, context);


                });

                namespaces[library.name] = ns;

            })(library, ns);

        }

    }

    if (libraries.length) {
        console.log('\n');
    }

    console.log('starting libraries');

    for (let library in namespaces) {

        if (!namespaces.hasOwnProperty(library)) continue;

        let ns = namespaces[library];
        library = libraries.items[library];
        library.rpc(ns);

    }

    console.log('\n');

};
