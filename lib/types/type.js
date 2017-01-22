/**
 * Returns the code of a type
 */

module.exports = function (Compiler) {
    "use strict";

    return function (module, config) {

        let compiler = new Compiler(module, config, language);

        let async = require('async');
        let error = require('./error.js')(module);

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);

        let fs = require('co-fs');

        Object.defineProperty(this, 'multilanguage', {
            'get': function () {
                return compiler.multilanguage;
            }
        });

        var returnSource = async(function *(resolve, reject, language) {

            let file;

            if (typeof config.source === 'string') {

                if (compiler.multilanguage) {
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

            let output = require('./header')(module);
            output += yield compiler.process(language);

            let resource = new Resource({'content': output, 'contentType': '.js'});
            resolve(resource);

        });

        /**
         * @param language
         * @param overwrite is actually used only by the script "custom"
         */
        this.process = async(function *(resolve, reject, language) {

            if (compiler.multilanguage && !language) {

                let message = 'Language must be set on a multilanguage type';
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

};
