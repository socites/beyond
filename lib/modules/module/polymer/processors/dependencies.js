var async = require('async');

module.exports = function (module, error) {
    "use strict";

    this.process = async(function *(resolve, reject, config) {

        if (!(config instanceof Array)) {
            reject(error('invalid processor configuration'));
            return;
        }

        // check all dependencies are strings
        for (let dependency of config) {
            if (typeof dependency !== 'string') {
                reject(error('invalid processor configuration, all dependencies must be strings'));
                return;
            }
        }

        let output = '';
        for (let dependency of config) {
            output = '<link rel="import" href="' + dependency + '" />\n';
        }

        if (output) output = '\n' + output;
        resolve(output);

    });

    Object.defineProperty(this, 'processor', {
        'get': function () {
            return 'js';
        }
    });

};
