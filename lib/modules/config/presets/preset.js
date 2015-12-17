var output = require('../../../config/output');

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
                output.warning('preset "'+name+'" has an invalid library specification');
                continue;
            }

            if (!libraries.items[library[0]] || !libraries.items[library[0]].versions.items[library[1]]) {
                output.warning('preset "'+name+'" specifies an invalid library or version');
                continue;
            }

            this.libraries.push(config.libraries[i]);

        }


    }

    if (config.excludes instanceof Array) this.excludes = config.excludes;

};
