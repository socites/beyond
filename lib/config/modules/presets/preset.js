require('colors');
module.exports = function (name, config, libraries) {
    "use strict";

    this.name = name;

    this.libraries = [];
    this.excludes = [];

    if (typeof config !== 'object') return;

    if (config.libraries instanceof Array) {

        for (let i in config.libraries) {

            let library = config.libraries[i];
            if (typeof library !== 'string' || (library = library.split('/')).length !== 2) {
                console.log('WARNING: preset "'.yellow +
                    (name).bold.yellow + '" has an invalid library specification.'.yellow);
                continue;
            }

            if (!libraries.items[library[0]] || !libraries.items[library[0]].versions.items[library[1]]) {
                console.log('WARNING: preset "'.yellow +
                    (name).bold.yellow + '" specifies an invalid library or version.'.yellow);
                continue;
            }

            this.libraries.push(config.libraries[i]);

        }


    }

    if (config.excludes instanceof Array) this.excludes = config.excludes;

};
