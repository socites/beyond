var async = require('async');

/**
 * Returns the script of all the start scripts of the modules of the application
 * and the modules of the libraries imported by the application
 *
 * @param application
 * @param overwrites
 * @param order
 */
module.exports = function (application, overwrites, order) {
    "use strict";

    return async(function *(resolve, reject, language, runtime) {

        let list = {}, items = {}, keys = [];
        let modules = application.modules;
        yield modules.process();

        for (let module of modules.keys) {

            module = modules.items[module];
            yield module.initialise();

            if (module.start) list[module.ID] = module;

        }

        // only include the modules that are specified in the ordered list
        for (let i in order) {

            let module = order[i];
            if (module.substr(0, 10) === 'libraries/') {

                let libraryName = module.substr(10);
                let library = application.libraries.items[libraryName];
                if (!library) continue;

                items[module] = library;
                keys.push(module);

            }
            else if (list[module]) {

                items[module] = list[module];
                keys.push(module);

            }

        }

        // complete the ordered list with all the modules not specified in the configuration
        for (let moduleID in list) {

            if (!(items[moduleID])) {

                items[moduleID] = list[moduleID];
                keys.push(moduleID);

            }

        }

        let libraries = application.libraries;
        for (let name of libraries.keys) {

            if (!(items['libraries/' + name])) {

                items['libraries/' + name] = libraries.items[name];
                keys.push('libraries/' + name);

            }

        }

        let script = '';
        for (let key of keys) {

            if (key.substr(0, 10) === 'libraries/') {

                let library = application.libraries.items[key.substr(10)];
                if (!library) continue;

                let code = yield library.start(language, overwrites);
                if (code) script += code + '\n\n';

                continue;

            }

            let module = items[key];

            let Finder = require('finder');
            let finder;

            let custom = {};
            if (key.substr(0, 10) === 'libraries/') {

                let item = key.substr(10);
                item = overwrites.items[item];

                if (item && item.start)
                    custom = {
                        'css': item.start.css,
                        'txt': item.start.txt,
                        'dirname': item.dirname
                    };

            }

            if (custom.css && custom.css.length) {
                finder = new Finder(custom.dirname, {
                    'list': custom.css, 'usekey': 'relative.file'
                });

                custom.css = finder;
            }

            if (custom.txt && custom.txt.length) {
                finder = new Finder(custom.dirname, {
                    'list': custom.txt, 'usekey': 'relative.file'
                });

                custom.txt = finder;
            }

            let code = yield module.start(language, custom);
            if (code && code.content) script += code.content + '\n\n';

        }

        resolve(script);

    });

};
