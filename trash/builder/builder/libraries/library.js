module.exports = require('async')(function *(resolve, reject, library, specs, path, events) {
    "use strict";

    let save = require('../fs/save');

    if (['beyond', 'deploy'].indexOf(specs.mode) === -1) {
        events.emit('error', 'Invalid mode specification');
        resolve(false);
        return;
    }

    let json = {
        'client': {'versions': {}},
        'server': {'versions': {}}
    };

    let paths = {
        'client': (typeof specs.client === 'string') ? specs.client : 'libraries/client/' + library.name,
        'server': (typeof specs.server === 'string') ? specs.server : 'libraries/server/' + library.name
    };

    paths.client = require('path').join(path, paths.client);
    paths.server = require('path').join(path, paths.server);


    // Compile versions
    for (let v of library.versions.keys) {

        let version = library.versions.items[v];

        let versionPaths = {
            'client': require('path').join(paths.client, version.version),
            'server': require('path').join(paths.server, version.version)
        };
        yield require('./version')(library, version, specs, versionPaths, json, events);

    }

    // Saving client library.json file
    if (specs.client && specs.mode === 'beyond') {

        let target;
        target = require('path').join(
            library.build.js,
            'library.json');

        yield save(target, JSON.stringify(json.client));

    }

    // Copy npm files
    if (specs.client) {
        yield require('./npm.js')(library, paths.client);
    }
    if (specs.server && library.connect) {
        yield require('./npm.js')(library, paths.server);
    }

    // Saving server library.json file
    if (specs.server && library.connect) {

        yield require('./service.js')(library, json, paths.server, events);

        let target = require('path').join(
            library.build.ws,
            'library.json');

        yield save(target, JSON.stringify(json.server));

    }

    resolve(true);

});
