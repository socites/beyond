module.exports = function (application, libraries, presets, config) {
    "use strict";

    let valid;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return valid;
        }
    });

    let imported = [];
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return imported;
        }
    });

    let includes = [];
    Object.defineProperty(this, 'includes', {
        'get': function () {
            return includes;
        }
    });

    let excludes = [];
    Object.defineProperty(this, 'excludes', {
        'get': function () {
            return excludes;
        }
    });

    // all applications requires to import beyond.js
    imported.push('beyond/v1');
    imported.push('vendor/v1');
    imported.push('ui/v1');

    if (!config) return;

    if (typeof config !== 'object') {
        console.log('Imports on application "'.red + (application.name).red.bold +
            '" are not properly configured.'.red);
        return;
    }


    if (config instanceof Array) config = {'libraries': config};

    // import from presets
    for (let i in config.presets) {

        let presetID = config.presets[i];
        if (typeof presetID !== 'string') continue;

        let preset = presets.items[presetID];
        if (!preset) {

            let message = 'Preset "'.red + (presetID).red.bold + '" on application "'.red +
                (application.name).red.bold + '" is not a registered preset'.red;
            console.log(message);

            continue;

        }

        // copy libraries from the current preset
        for (let j in preset.libraries) {

            let library = preset.libraries[j].split('/');
            if (library.length !== 2) {

                let message = 'Library on index "'.red + j.toString().red.bold +
                    '" of preset "' + (presetID).red.bold + '" on application "'.red +
                    (application.name).red.bold + '" is not valid, check if version is correctly set.'.red;
                console.log(message);

                continue;

            }

            let version = library[1];
            library = library[0];

            // check if library exists
            if (!libraries.items[library]) {

                let message = 'Library "'.red + (library).red.bold +
                    'on preset "'.red + (presetID).red.bold + '" '.red +
                    '" on application "'.red + (application.name).red.bold + '" does not exist.'.red;
                console.log(message);

                continue;

            }

            // check if the version of the library exists
            library = libraries.items[library];
            if (!library.versions.items[version]) {

                let message = 'Version "'.red + (version).red.bold + '" of library "'.red + (library).red.bold +
                    'on preset "'.red + (presetID).red.bold + '" '.red +
                    '" on application "'.red + (application.name).red.bold + '" does not exist.'.red;
                console.log(message);

                continue;

            }

            // check that library was not previously imported
            let duplicated;
            for (let i in imported) {

                let item = imported[i].split('/');
                if (item[0] === library.ID) {

                    let message = 'Library "'.yellow + (library).yellow.bold +
                        'on preset "'.yellow + (presetID).yellow.bold + '" '.yellow +
                        '" is imported more that once.'.yellow;
                    console.log(message);

                    duplicated = true;

                }

            }

            if (!duplicated) imported.push(preset.libraries[j]);

            for (let i in preset.includes) {
                includes.push(preset.includes[i]);
            }
            for (let i in preset.excludes) {
                excludes.push(preset.excludes[i]);
            }

        }

    }

    // copy and verify libraries
    for (let i in config.libraries) {

        let library = config.libraries[i].split('/');
        if (library.length !== 2) {

            let message = 'Library on index "'.red + i.toString().red.bold +
                '" on application "'.red + (application.name).red.bold +
                '" is not valid, check if version is correctly set.'.red;
            console.log(message);

            continue;

        }

        let version = library[1];
        library = library[0];

        // check if library exists
        if (!libraries.items[library]) {

            let message = 'Library "'.red + (library).red.bold +
                '" on application "'.red + (application.name).red.bold + '" does not exist.'.red;
            console.log(message);

            continue;

        }

        // check if the version of the library exists
        library = libraries.items[library];
        if (!library.versions.items[version]) {

            let message = 'Version "'.red + (version).red.bold + '" of library "'.red + (library.name).red.bold + '" '.red +
                'specified on import "'.red + (i).red.bold + '" '.red +
                'on application "'.red + (application.name).red.bold + '" does not exist.'.red;
            console.log(message);

            continue;

        }

        // check that library was not previously imported
        let duplicated;
        for (let i in imported) {

            let item = imported[i].split('/');
            if (item[0] === library.ID) {

                let message = 'Library "'.yellow + (library).yellow.bold +
                    '" is imported more that once.'.yellow;
                console.log(message);

                duplicated = true;

            }

        }

        if (!duplicated) imported.push(config.libraries[i]);

    }

    let copyModules = function (type, from, to) {

        for (let i in from) {

            if (typeof from[i] !== 'string') {

                let message = (type).red + ' "'.red + (i.toString()).red.bold + '" on application "'.red +
                    (application.name).red.bold + '" is not valid.'.red;
                console.log(message);

                continue;

            }

            to.push(from[i]);

        }

    };

    copyModules('include', config.includes, includes);
    copyModules('exclude', config.excludes, excludes);

    valid = true;

};
