module.exports = function (application, libraries, config, runtime) {
    "use strict";

    return function (language) {

        if (!language) throw new Error('language not set');

        let hosts = {};

        if (!runtime.local) hosts.application = {
            'js': config.build.hosts.js,
            'ws': config.build.hosts.ws,
            'version': application.version
        };
        else hosts.application = {
            'js': '/' + application.name + '/' + language,
            'ws': '/' + application.name,
            'version': application.version
        };

        for (let i in config.imports.libraries) {

            let library = config.imports.libraries[i];
            library = library.split('/');
            library = {'name': library[0], 'version': library[1]};
            let version = library.version;

            library = libraries.items[library.name];
            version = library.versions.items[version];

            if (!hosts.libraries) hosts.libraries = {};
            hosts.libraries[library.name] = version.hosts;

        }

        return hosts;

    };

};
