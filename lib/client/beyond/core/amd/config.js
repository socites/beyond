/**
 * Register the paths of the imported libraries by the application
 *
 * @param hosts {object} Hosts configuration
 * @constructor
 */
let AMDConfig = function (hosts) {

    let paths = {};

    if (hosts.application.js) {
        paths.application = hosts.application.js;
    }

    for (let hosts of hosts.libraries) {
        paths[hosts.path] = hosts.js;
    }

    requirejs.config({'paths': paths});

    Object.defineProperty(this, 'paths', {'get': () => requirejs.s.contexts._.config.paths});

};
