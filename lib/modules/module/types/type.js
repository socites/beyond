/**
 * Wrapper to the Type.
 * Checks if the code is compiled, then takes the code from the source property. Otherwise, process the type.
 * Adds the header of the code.
 */

module.exports = function (Type, name) {
    "use strict";

    return function (module, config) {

        let error = require('./error.js')(module, name);
        let type = new Type(module, config, error);

        let async = require('async');

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);

        let fs = require('co-fs');

        Object.defineProperty(this, 'multilanguage', {
            'get': function () {
                return type.multilanguage;
            }
        });

        Object.defineProperty(this, 'extname', {
            'get': function () {
                return type.extname;
            }
        });

        var returnSource = async(function *(resolve, reject, language) {

            let file;

            if (typeof config.source === 'string') {

                if (type.multilanguage) {
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

            let output = require('./header')(module, type.extname);
            output += yield type.process(language);

            let resource = new Resource({'content': output, 'contentType': type.extname});
            resolve(resource);

        });

        /**
         * @param language
         * @param overwrite is actually used only by the script "custom"
         */
        this.process = async(function *(resolve, reject, language) {

            if (type.multilanguage && !language) {

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

        // Used by the type to set the specific configuration required on module.json
        this.setBuildConfig = async(function *(resolve, reject, json) {

            if (type.setBuildConfig) {
                yield type.setBuildConfig(json);
            }

            resolve();

        });

        this.start = type.start;

    };

};
