require('colors');

module.exports = require('async')(function *(resolve, reject, modules, specs, path) {
    "use strict";

    if (typeof specs !== 'object') {
        console.log('Invalid libraries build configuration'.red);
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
            console.log('\tLibrary "'.red + (name).red.bold + '" is not registered'.red);
            continue;
        }

        let success = yield require('./library.js')(library, specs[name], path);
        if (!success) {
            continue;
        }

        let target = require('path').join(library.build.path, 'library.json');
        if (specs.client) {
            json.client[name] = target;
        }
        if (library.connect && specs.server) {
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

    if (specs.server) {

        target = require('path').join(
            path,
            'libraries/server',
            'libraries.json');

        yield save(target, JSON.stringify(json.server));

    }

    // write an empty line in the console
    console.log('');

    resolve();

});
