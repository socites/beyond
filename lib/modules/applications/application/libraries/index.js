// The libraries imported by the application
module.exports = function (application, config, libraries, runtime) {
    "use strict";

    let items = {};
    let keys = [];
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });

    Object.defineProperty(this, 'length', {
        'get': function () {
            return keys.length;
        }
    });

    for (let library of config.libraries) {

        library = library.split('/');
        library = {'name': library[0], 'version': library[1], 'full': library.join('/')};

        let extract = function (from, to) {

            for (let i in from) {

                let module = from[i];

                // extract library from its version
                let length = library.name.length;

                if (module.substr(0, length + 11) === 'libraries/' + library.name + '/') {

                    module = module.substr(length + 11);

                    if (to.indexOf(module) !== -1) continue;
                    to.push(module);

                }

            }

        };

        let imports = {'includes': [], 'excludes': []};

        // the configuration of includes and excludes of the modules
        // contains the modules of all the libraries mixed on the lists,
        // so it is required to separate the specific modules of each library
        // ['common:moduleX', 'auth:moduleY']
        extract(config.includes, imports.includes);
        extract(config.excludes, imports.excludes);

        for (let i = imports.excludes.length - 1; i >= 0; i--) {

            if (config.includes.indexOf(imports.excludes[i]) !== -1)
                imports.excludes.splice(i, 1);

        }

        // remove from the excludes list, the modules that are in the includes list
        for (let i = imports.excludes.length - 1; i >= 0; i--)
            if (imports.includes.indexOf(imports.excludes[i]) !== -1)
                imports.excludes.splice(i, 1);

        let version = library.version;
        library = libraries.items[library.name];
        version = library.versions.items[version];

        library = new (require('./library'))(application, library, version, imports.excludes, runtime);

        items[library.name] = library;
        keys.push(library.name);

    }

};
