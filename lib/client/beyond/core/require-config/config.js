let RequireConfig = function (events) {
    'use strict';

    onError(events);

    // register the paths of the imported libraries by the application
    let hosts = beyond.hosts;
    let paths = {};
    let host;

    if (hosts.application && typeof hosts.application.js === 'string') {

        if (location.protocol === 'file:') {
            host = hosts.application.js;
            if (!host) {
                host = '.';
            }
        }
        else {
            host = location.origin + hosts.application.js;
        }

        // Remove the last '/' of the host
        if (host.substr(host.length - 1) === '/') {
            host = host.substr(0, host.length - 1);
        }

        paths.application = host;

    }

    for (let name in hosts.libraries) {

        let library = hosts.libraries[name];

        if (location.protocol === 'file:') {
            host = library.js;
        }
        else {
            host = location.origin;
            host += (library.js.substr(0, 1) !== '/') ? '/' : '';
            host += library.js;
        }

        // Remove the last '/' of the host
        if (host.substr(host.length - 1) === '/') {
            host = host.substr(0, host.length - 1);
        }

        paths['libraries/' + name] = host;

    }

    requirejs.config({'paths': paths});

    Object.defineProperty(this, 'paths', {
        'get': function () {
            return requirejs.s.contexts._.config.paths;
        }
    });

};
