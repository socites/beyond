require('colors');

module.exports = require('async')(function *(resolve, reject, library, specs, path) {
    "use strict";

    let save = require('../fs/save');

    if (['beyond', 'deploy'].indexOf(specs.mode) === -1) {
        console.log('\tInvalid mode specification'.red);
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
            console.log('\tconfigured version "'.red + (v).bold.red + '" does not exist');
            resolve(false);
            return;
        }

        yield require('./version')(version, specs, path, json);

    }
    else {

        // Compile all versions
        for (let v of library.versions.keys) {
            let version = library.versions.items[v];
            yield require('./version')(version, specs, path, json);
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
        yield require('./npm.js')(library, path);
    }

    // Saving server library.json file
    if (specs.server && library.connect) {

        yield require('./service.js')(library, json);

        let target = require('path').join(
            library.build.ws,
            'library.json');

        yield save(target, JSON.stringify(json.server));

    }

    resolve(true);

});
