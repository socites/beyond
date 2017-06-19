module.exports = function (application, libraries, config, runtime) {
    "use strict";

    /**
     * @language false returns the hosts of the libraries, then the language is not required
     */
    return function (language) {

        let mode = 'web';
        if (runtime.build &&
            runtime.build.applications &&
            runtime.build.applications[application.name] &&
            runtime.build.applications[application.name].client &&
            runtime.build.applications[application.name].client.mode) {

            mode = runtime.build.applications[application.name].mode;
        }

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
            if (mode === 'phonegap') {
                hostJS = '';
            }
            else if (config.build.hosts.js) {
                hostJS = '/' + config.build.hosts.js + '/';
            }
            else {
                hostJS = '/';
            }

            hosts.application = {
                'js': hostJS
            };

            if (application.connect) {

                let url = require('url').parse(config.build.hosts.ws);
                let protocol = url.protocol;
                if (protocol !== 'wss:') protocol = 'wss:';
                let port = url.port;
                if (!port && protocol === 'ws:') port = '80';
                if (!port && protocol === 'wss:') port = '443';

                let host = protocol + '://' + url.hostname + ':' + port + '/' + application.name;
                hosts.ws = host;

                hosts.application = {
                    'js': hosts.application.js,
                    'ws': host,
                    'version': application.version
                };

                hosts.application.ws = hosts.ws.replace('$version', application.version);

            }

        }

        // Configure hosts.ws of libraries
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

        // Configure hosts.js of libraries
        if (!runtime.local) {

            for (let name in hosts.libraries) {

                let library = libraries.items[name];
                let path = library.build.path;

                let sep = require('path').sep;
                if (sep !== '/') path = path.replace(new RegExp('\\' + sep, 'g'), '/');

                if (path.substr(0, 1) === '.') path = path.substr(1);
                if (path.substr(0, 1) === '/') path = path.substr(1);

                let host = (mode === 'phonegap') ? 'libraries/' : hosts.application.js + 'libraries/';
                if (path) {
                    host += path + '/';
                }

                hosts.libraries[name].js = host;

            }

        }

        return hosts;

    };

};
