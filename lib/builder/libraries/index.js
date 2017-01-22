require('colors');

module.exports = require('async')(function *(resolve, reject, modules, languages, specs, buildPath) {
    "use strict";

    if (typeof specs !== 'object') {
        console.error('Invalid libraries build configuration')
        resolve();
        return;
    }

    let fs = require('co-fs');
    let save = require('../fs/save');

    let libraries = modules.libraries;
    let json = {'client': {}, 'server': {}};

    for (let name in specs) {

        console.log('compiling library "'.green + (name).bold.green + '"');

        let library = libraries.items[name];
        if (!library) {
            console.log('\tLibrary "' + name + '" is not registered'.red);
            continue;
        }

        let success = yield require('./library.js')(library, languages, specs[name]);
        if (!success) {
            continue;
        }

        let path = require('path').join(library.build.path, 'library.json');
        if (specs.client) {
            json.client[name] = path;
        }
        if (library.connect && specs.server) {
            json.server[name] = path;
        }

    }

    let target;

    if (specs.mode === 'beyond') {

        target = require('path').join(
            buildPath,
            'libraries/client',
            'libraries.json');

        yield save(target, JSON.stringify(json.client));

    }

    if (specs.server) {

        target = require('path').join(
            buildPath,
            'libraries/server',
            'libraries.json');

        yield save(target, JSON.stringify(json.server));

    }

    // write an empty line in the console
    console.log('');

    resolve();

});
