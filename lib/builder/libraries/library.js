require('colors');

module.exports = require('async')(function *(resolve, reject, library, languages, specs) {
    "use strict";

    let async = require('async');

    if (['beyond', 'deploy'].indexOf(specs.mode) === -1) {
        console.log('\tInvalid mode specification'.red);
        resolve(false);
        return;
    }

    let json = {
        'client': {'versions': {}},
        'server': {'versions': {}}
    };

    var buildVersion = async(function *(resolve, reject, version) {

        console.log('\tbuilding version "'.green + (version.version).bold.green + '"');

        json.client.versions[v] = {
            'build': {'hosts': version.build.hosts}
        };
        json.server.versions[v] = {};

        if (version.start) {
            json.client.versions[v].start = version.start;
        }

        yield require('./version.js')(version, specs);

    });

    if (specs.version) {

        let v = specs.version;
        let version = library.versions.items[v];
        if (!version) {
            console.log('\tconfigured version "'.red + (v).bold.red + '" does not exist');
            resolve(false);
            return;
        }

        yield buildVersion(version);

    }
    else {

        // Compile all versions
        for (let v of library.versions.keys) {
            let version = library.versions.items[v];
            yield buildVersion(version);
        }

        resolve(true);

    }

    // Saving client library.json file
    if (specs.mode === 'beyond') {

        let target;
        target = require('path').join(
            library.build.js,
            'library.json');

        yield save(target, JSON.stringify(json.client));

    }

    // Saving server library.json file
    if (specs.server && library.connect) {

        let target = require('path').join(
            library.build.ws,
            'library.json');

        yield save(target, JSON.stringify(json.server));

    }

});
