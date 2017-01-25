/**
 * Returns the script of all the start scripts of the modules of the application
 * and the modules of the libraries imported by the application
 *
 * @param application
 * @param template
 * @param order
 */
module.exports = function (application, order) {
    "use strict";

    let async = require('async');

    return async(function *(resolve, reject, language, runtime) {

        let ordered = yield (require('./ordered.js')(application, order));

        let script = '';
        for (let key of ordered.keys) {

            if (key.substr(0, 10) === 'libraries/') {

                // Process the library

                let library = application.libraries.items[key.substr(10)];
                if (!library) {
                    continue;
                }

                let code = yield library.start(language);
                if (code) script += code + '\n\n';

            }
            else {

                // Process the application module

                let module = ordered.items[key];
                if (!module) {
                    continue;
                }

                let code = yield module.start(language, application.template);
                if (code && code.content) script += code.content + '\n\n';

            }

        }

        resolve(script);

    });

};
