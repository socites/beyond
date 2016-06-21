// the start code of the library

var async = require('async');
module.exports = function (library, modules, order, runtime) {
    "use strict";

    return async(function *(resolve, reject, language, overwrites) {

        let list = {}, items = {}, keys = [];
        yield modules.process();

        if (!modules.keys) {
            resolve('');
            return;
        }

        for (let module of modules.keys) {

            module = modules.items[module];
            yield module.initialise();

            if (module.start) list[module.ID] = module;

        }

        // only include the modules that are specified in the ordered list
        for (let i in order) {

            let module = 'libraries/' + library.name + '/' + order[i];
            if (list[module]) {

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

        let script = '';
        for (let key of keys) {

            let module = items[key];

            let Finder = require('finder');
            let finder;

            let custom = {};

            // remove the libraries/
            let overwrite = key.substr(10);
            overwrite = overwrites.items[overwrite];

            if (overwrite && overwrite.start)
                custom = {
                    'css': overwrite.start.css,
                    'txt': overwrite.start.txt,
                    'dirname': overwrite.dirname
                };

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
