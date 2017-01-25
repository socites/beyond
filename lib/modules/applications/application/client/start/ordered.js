module.exports = require('async')(function *(resolve, reject, application, order) {
    "use strict";

    let list = {}, items = {}, keys = [];

    // Find all the application modules
    let modules = application.modules;
    yield modules.process();

    for (let module of modules.keys) {

        module = modules.items[module];
        yield module.initialise();

        if (module.start) {
            list[module.ID] = module;
        }

    }

    // Only include the libraries and modules that are specified in the ordered list
    for (let i in order) {

        let moduleID = order[i];
        if (moduleID.substr(0, 10) === 'libraries/') {

            let libraryName = moduleID.substr(10);
            let library = application.libraries.items[libraryName];
            if (!library) {
                continue;
            }

            items[moduleID] = library;
            keys.push(moduleID);

        }
        else if (list[moduleID]) {

            items[moduleID] = list[moduleID];
            keys.push(moduleID);

        }

    }

    // Complete the ordered list with all the modules not specified in the configuration
    for (let moduleID in list) {

        if (!(items[moduleID])) {

            items[moduleID] = list[moduleID];
            keys.push(moduleID);

        }

    }

    // Complete the ordered list with all the libraries not specified in the configuration
    let libraries = application.libraries;
    for (let name of libraries.keys) {

        if (!(items['libraries/' + name])) {

            items['libraries/' + name] = libraries.items[name];
            keys.push('libraries/' + name);

        }

    }

    resolve({'keys': keys, 'items': items});

});
