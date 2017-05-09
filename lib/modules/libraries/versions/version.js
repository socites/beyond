module.exports = function (library, version, config, runtime) {
    "use strict";

    Object.defineProperty(this, 'version', {
        'get': function () {
            return version;
        }
    });

    Object.defineProperty(this, 'path', {
        'get': function () {
            return config.path;
        }
    });

    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return config.dirname;
        }
    });

    Object.defineProperty(this, 'build', {
        'get': function () {
            return config.build;
        }
    });

    this.modules = new (require('./modules'))(library, this, runtime);
    this.valid = true;

    Object.defineProperty(this, 'start', {
        'get': function () {
            return config.start;
        }
    });

    Object.defineProperty(this, 'hosts', {
        'get': function () {

            if (runtime.local) {

                let hosts = {
                    'js': '/libraries/' + library.name + '/' + version + '/',
                    'version': version
                };
                if (library.connect) {

                    if (config.ws) {

                        let url = require('url').parse(config.ws);
                        let protocol = url.protocol;
                        if (protocol !== 'ws:') protocol = 'wss:';
                        let port = url.port;
                        if (!port && protocol === 'ws:') port = '80';
                        if (!port && protocol === 'wss:') port = '443';

                        let host = protocol + '//' + url.hostname + ':' + port + '/libraries/' + library.name;
                        hosts.ws = host;

                    }
                    else {
                        hosts.ws = '/libraries/' + library.name;
                    }

                }

                return hosts;

            }
            else {

                let hosts = {};

                hosts.js = config.build.hosts.js;

                if (library.connect) {

                    let url = require('url').parse(config.build.hosts.ws);

                    if (url.hostname) {
                        let protocol = url.protocol;
                        if (protocol !== 'ws:') protocol = 'wss:';
                        let port = url.port;
                        if (!port && protocol === 'ws:') port = '80';
                        if (!port && protocol === 'wss:') port = '443';

                        let host = protocol + '//' + url.hostname + ':' + port + '/libraries/' + library.name;
                        hosts.ws = host;
                    }
                    else {
                        hosts.ws = config.build.hosts.ws;
                    }

                }

                if (library.connect) hosts.version = version;

                hosts.js = hosts.js.replace('$version', version.version);
                if (library.connect) hosts.ws = hosts.ws.replace('$version', version.version);
                else delete hosts.ws;

                return hosts;

            }

        }
    });

};
