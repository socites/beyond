require('colors');

module.exports = require('async')(function *(resolve, reject, library, languages, specs, librariesJson) {
    "use strict";

    if (specs.version) {

        let version = library.versions.items[specs.version];
        if (!version) {
            console.log('\tconfigured version "'.red + (v).bold.red + '" does not exist');
            resolve();
            return;
        }

        for (let language in languages) {
            yield require('./version.js')(version, language);
        }

    }
    else {

        // Compile all versions
        for (let v of library.versions.keys) {

            console.log('\tcompiling version "'.green + (v).bold.green + '"');
            let version = library.versions.items[v];

            for (let language in languages) {
                yield require('./version.js')(version, language);
            }

        }

        resolve();

    }

});
