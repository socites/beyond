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

    // Compile versions
    if (specs.version) {

        // Compile single version
        let v = specs.version;
        let version = library.versions.items[v];
        if (!version) {
            events.emit('error', 'configured version "' + v + '" does not exist');
            resolve(false);
            return;
        }

        yield require('./version')(library, version, specs, path, json, events);

    }
    else {

        // Compile all versions
        for (let v of library.versions.keys) {
            let version = library.versions.items[v];
            yield require('./version')(library, version, specs, path, json, events);
        }

    }

    // Saving client library.json file
    if (specs.client && specs.mode === 'beyond') {

        let target;
        target = require('path').join(
            library.build.js,
            'library.json');

        yield save(target, JSON.stringify(json.client));

    }

    // Copy package.json file
    if (specs.client && library.npm) {
        yield require('./npm.js')(library, path, events);
    }

    // Saving server library.json file
    if (specs.server && library.connect) {

        yield require('./service.js')(library, json, events);

        let target = require('path').join(
            library.build.ws,
            'library.json');

        yield save(target, JSON.stringify(json.server));

    }

    resolve(true);

});
