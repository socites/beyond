require('colors');

module.exports = require('async')(function *(resolve, reject, libraries, specs, librariesJson) {
    "use strict";

    let library = libraries.items[name];

    if (specs.version) {

        let version = library.versions.items[specs.version];
        if (!version) {
            console.log('\tconfigured version "'.red + (v).bold.red + '" does not exist');
            resolve();
            return;
        }

        yield require('./version.js')(version);

    }
    else {

        // Compile all versions
        for (let v of library.versions.keys) {

            console.log('\tcompiling version "'.green + (v).bold.green + '"');
            let version = library.versions.items[v];

        }

        resolve();

    }

});
