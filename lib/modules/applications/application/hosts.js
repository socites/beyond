module.exports = function (application, libraries, config, runtime) {
    "use strict";

    return function (language) {

        if (!language) throw new Error('language not set');

        let hosts = {};

        if (!runtime.local) {

            hosts.application = {
                'js': config.build.hosts.js
            };

            hosts.application.js = hosts.application.js.replace('$version', application.version);

            if (application.connect) {

                let url = require('url').parse(config.build.hosts.ws);
                let protocol = url.protocol;
                if (protocol !== 'wss') protocol = 'ws';

                let host = protocol + '://' + url.hostname + '/' + application.name;
                hosts.ws = host;

                hosts.application = {
                    'js': hosts.application.js,
                    'ws': host,
                    'version': application.version
                };

                hosts.application.ws = hosts.ws.replace('$version', application.version);

            }

        }
        else {

            hosts.application = {
                'js': '/' + application.name + '/' + language
            };

            if (application.connect) {

                hosts.application = {
                    'js': hosts.application.js,
                    'ws': '/' + application.name,
                    'version': application.version
                };

            }

        }

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

        if (!runtime.local && application.build.libraries) {

            for (let name in hosts.libraries) {

                let library = libraries.items[name];
                let path = library.build.path;

                let sep = require('path').sep;
                if (sep !== '/') path = path.replace(new RegExp('\\' + sep, 'g'), '/');

                if (path.substr(0, 1) === '.') path = path.substr(1);
                if (path.substr(0, 1) === '/') path = path.substr(1);

                hosts.libraries[name].js = '/libraries/' + path;

            }

        }

        return hosts;

    };

};
