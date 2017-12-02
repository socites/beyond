// The start code of the library
// It is called from the application/client/start module

module.exports = function (application, library, modules, order) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, language) {

        // Process modules
        yield modules.process();
        if (!modules.keys) {
            resolve('');
            return;
        }

        // Order the modules according configuration
        let ordered = yield (require('./ordered.js')(library, modules, order));

        // Build script
        let script = '';
        for (let key of ordered.keys) {

            let module = ordered.items[key];

            let code = yield module.start(language);
            if (code && code.content) script += code.content + '\n\n';

        }

        resolve(script);

    });

};
