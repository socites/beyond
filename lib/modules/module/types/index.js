var async = require('async');

/**
 * Returns the code of a type
 */
module.exports = function (module, config) {
    "use strict";

    let error = require('./error.js')(module);
    let code = require('./code/');

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    let fs = require('co-fs');

    var returnSource = async(function *(resolve, reject, language) {

        let file;

        if (typeof config.source === 'string') {

            if (config.multilanguage) {
                let message = 'Invalid source configuration. Source does not specify language "' + language + '".';
                reject(error(message));
                return;
            }

            file = require('path').join(module.dirname, config.source);

        }
        else if (typeof config.source === 'object') {

            let source = config.source[language];
            if (!source) {
                let message = 'Language "' + language + '" not specified';
                reject(error(message));
                return;
            }

            file = require('path').join(module.dirname, source);

        }

        if (!(yield fs.exists(file))) {
            let message = 'File "' + file + '" does not exist';
            reject(error(message));
            return;
        }

        let resource = new Resource({'file': file, 'relative': config.source});
        resolve(resource);

    });

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
