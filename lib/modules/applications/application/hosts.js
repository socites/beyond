module.exports = function (application, libraries, config, runtime) {
    "use strict";

    /**
     * @language false returns the hosts of the libraries, then the language is not required
     */
    return function (language) {

        if (typeof language !== 'boolean' && !language) {
            throw new Error('language not set');
        }

        let hosts = {};

        if (runtime.local) {

            if (language) {
                hosts.application = {
                    'js': '/applications/' + application.name + '/languages/' + language + '/'
                };
            }

            if (application.connect) {

                hosts.application = {
                    'js': hosts.application.js,
                    'ws': '/' + application.name,
                    'version': application.version
                };

            }

        }
        else {

            let hostJS;
            if (runtime.build && runtime.build.applications && runtime.build.applications[application.name]) {

                if (runtime.build.applications[application.name].mode === 'phonegap') {
                    hostJS = '';
                }

            }
            else {
                hostJS = config.build.hosts.js;
                hostJS = hostJS.replace('$version', application.version);
            }

            hosts.application = {
                'js': hostJS
            };

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

        for (let i in config.imports.libraries) {

            let library = config.imports.libraries[i];
            library = library.split('/');
            library = {'name': library[0], 'version': library[1]};
            let version = library.version;

            library = libraries.items[library.name];
            version = library.versions.items[version];

            if (!hosts.libraries) {
                hosts.libraries = {};
            }

            hosts.libraries[library.name] = version.hosts;

            // Check if ws address is overwrited by application config
            if (runtime.local && version.hosts.ws && application.ws[library.name]) {
                let host = application.ws[library.name] + '/libraries' + '/' + library.name;
                hosts.libraries[library.name].ws = host;
            }

        }

        if (runtime.build && runtime.build.applications &&
            runtime.build.applications[application.name] &&
            runtime.build.applications[application.name].mode === 'phonegap') {

            for (let name in hosts.libraries) {

                let library = libraries.items[name];
                let path = library.build.path;

                let sep = require('path').sep;
                if (sep !== '/') path = path.replace(new RegExp('\\' + sep, 'g'), '/');

                if (path.substr(0, 1) === '.') path = path.substr(1);
                if (path.substr(0, 1) === '/') path = path.substr(1);

                let host = '/libraries/' + path + '/';

                host = host.replace(/\\/g, '/');
                hosts.libraries[name].js = host;

            }

        }

        return hosts;

    };

};
