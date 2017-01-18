require('colors');

module.exports = require('async')(function *(resolve, reject, modules, languages, specs, buildPath) {
    "use strict";

    if (typeof specs !== 'object') {
        console.error('Invalid libraries build configuration')
    }

    let fs = require('co-fs');
    let save = require('../fs/save');

    let libraries = modules.libraries;
    let librariesJson = {'js': {}, 'ws': {}};

    for (let name in specs) {

        console.log('compiling library "'.green + (name).bold.green + '"');

        let librarySpecs = specs[name];
        if (['beyond', 'deploy'].indexOf(librarySpecs.mode) === -1) {
            console.log('\tInvalid mode specification'.red);
            continue;
        }

        let library = libraries.items[name];

        require('./library.js')(library, languages, librarySpecs, librariesJson);

    }

    let target;

    if (specs.mode === 'beyond') {

        target = require('path').join(
            buildPath,
            'libraries/client',
            'libraries.json');

        yield save(target, JSON.stringify(librariesJson.js));

    }

    if (specs.server) {

        target = require('path').join(
            buildPath,
            'libraries/server',
            'libraries.json');

        yield save(target, JSON.stringify(librariesJson.ws));

    }

    // write an empty line in the console
    console.log('');

    resolve();

});
