var async = require('async');

module.exports = function (application) {
    "use strict";

    let process = async(function *(resolve, reject) {
        "use strict";

        let routes = {};

        let processModules = async(function *(resolve, reject, modules) {

            yield modules.process();

            for (let module of modules.keys) {

                module = modules.items[module];
                yield module.initialise();

                if (module.route) {

                    let route;
                    let moduleID = module.ID;

                    if (module.path === '.') moduleID += '/main';

                    if (!module.route.floating) route = moduleID;
                    else route = {'moduleID': moduleID, 'floating': true};

                    routes[module.route.pathname] = route;
                }

            }

            resolve();

        });


        // process application modules
        yield processModules(application.modules);

        // process the modules of the libraries of the application
        let libraries = application.libraries;
        for (let library of libraries.keys) {

            library = libraries.items[library];

            library.modules.libname = library.name;
            yield processModules(library.modules);

        }

        resolve(routes);

    });

    let routes;
    Object.defineProperty(application, 'routes', {
        'get': async(function *(resolve, reject) {

            if (routes) {
                resolve(routes);
                return;
            }

            try {
                routes = yield process();
            }
            catch (exc) {
                reject(exc);
            }

            resolve(routes);

        })
    });

};
