/**
 * Register the paths of the imported libraries by the application
 *
 * @param hosts {object} Hosts configuration
 * @constructor
 */
let AMDConfig = function (hosts, events) {

    Object.defineProperty(this, 'paths', {'get': () => requirejs.s.contexts._.config.paths});

    requirejs.onError = function (error) {

        if (error.requireType === 'timeout') {

            events.trigger('error');
            let modules = error.requireModules;
            for (let module of modules) {
                requirejs.undef(module);
            }

            // Try again loading modules
            require(modules, () => events.trigger('retried', modules));

        }
        else {
            console.log(error.stack);
        }

    };

    // Set the require js paths for the application and libraries
    (function () {

        let paths = {};
        if (hosts.application.js) {
            paths.application = hosts.application.js;
        }
        for (let hosts of hosts.libraries) {
            paths[hosts.path] = hosts.js;
        }

        requirejs.config({'paths': paths});

    })();

};
