module.exports = function (library, version, config, runtime) {
    "use strict";

    Object.defineProperty(this, 'version', {
        'get': function () {
            return version;
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
                    'js': '/libraries/' + library.name + '/' + version,
                    'version': version
                };
                if (library.connect) {
                    if (config.ws) hosts.ws = config.ws;
                    else hosts.ws = '/libraries/' + library.name;
                }

                return hosts;

            }
            else {

                let hosts = {};

                hosts.js = config.build.hosts.js;

                if (library.connect) {
                    let url = require('url').parse(config.build.hosts.ws);
                    let host = 'ws://' + url.hostname + '/libraries/' + library.name;
                    hosts.ws = host;
                }

                if (library.connect) hosts.version = version;

                hosts.js = hosts.js.replace('$version', version.version);
                if (library.connect) hosts.ws = hosts.ws.replace('$version', version.version);
                else delete hosts.ws;

                return config.build.hosts;

            }

        }
    });

};
