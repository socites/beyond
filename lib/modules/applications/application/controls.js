var async = require('async');

module.exports = function (application) {
    "use strict";

    let process = async(function *(resolve, reject) {
        "use strict";

        let controls = {};

        let processModules = async(function *(resolve, reject, modules) {

            yield modules.process();

            for (let module of modules.keys) {

                module = modules.items[module];
                yield module.initialise();

                if (module.control) {

                    let moduleID = module.ID;
                    if (module.path === '.') moduleID += '/main';

                    controls[moduleID] = module.control;

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

        resolve(controls);

    });

    let controls;
    Object.defineProperty(application, 'controls', {
        'get': async(function *(resolve, reject) {

            if (controls) {
                resolve(controls);
                return;
            }

            try {
                controls = yield process();
            }
            catch (exc) {
                reject(exc);
            }

            resolve(controls);

        })
    });

};
