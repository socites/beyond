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
            else return config.build.hosts;

        }
    });

};
