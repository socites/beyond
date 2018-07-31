let sockets = new Map();
beyond.libraries.extend('socket', {'type': 'property'}, async function (library) {

    if (sockets.has(library.id)) {
        return sockets.get(library.id);
    }


});
