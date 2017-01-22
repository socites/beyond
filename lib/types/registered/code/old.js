var async = require('async');

/**
 * Returns the code of the script
 */
module.exports = function (module, config) {
    "use strict";

    var returnCode = async(function *(resolve, reject, language) {

        let script = yield code(module, config, language);

        let output = require('./header')(module);
        output += scope(script, module.standalone);

        let resource = new Resource({'content': output, 'contentType': '.js'});
        resolve(resource);

    });

    /**
     * @param language
     * @param overwrite is actually used only by the script "custom"
     */
    return async(function *(resolve, reject, language) {

        if (config.multilanguage && !language) {

            let message = 'Language must be set on a multilanguage module';
            reject(error(message));
            return;

        }

        if (config.source) {
            resolve(yield returnSource(language));
        }
        else {
            resolve(yield returnCode(language));
        }

    });

};
