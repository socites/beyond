module.exports = require('async')(function *(resolve, reject, modules, specs, path, events) {
    "use strict";

    if (typeof specs !== 'object') {
        events.emit('error', 'Invalid libraries build configuration');
        resolve();
        return;
    }

    let fs = require('co-fs');
    let save = require('../fs/save');

    let libraries = modules.libraries;
    let json = {'client': {}, 'server': {}};

    let server;

    for (let name in specs) {

        events.emit('message', 'compiling library "' + name + '"');

        let library = libraries.items[name];
        if (!library) {
            events.emit('error', 'Library "' + name + '" is not registered');
            continue;
        }

        let success = yield require('./library.js')(library, specs[name], path, events);
        if (!success) {
            continue;
        }

        let target = require('path').join(library.build.path, 'library.json');
        if (specs[name].client) {
            json.client[name] = target;
        }
        if (library.connect && specs[name].server) {
            server = true;
            json.server[name] = target;
        }

    }

    let target;

    if (specs.mode === 'beyond') {

        target = require('path').join(
            path,
            'libraries/client',
            'libraries.json');

        yield save(target, JSON.stringify(json.client));

    }

    if (server) {

        target = require('path').join(
            path,
            'libraries/server',
            'libraries.json');

        yield save(target, JSON.stringify(json.server));

    }

    resolve();

});
