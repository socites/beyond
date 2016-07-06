var async = require('async');

module.exports = function (module, config) {
    "use strict";

    return async(function *(resolve, reject, language, overwrites) {

        if (!config.polymer.id) {
            resolve();
            return;
        }

        let script;
        let id = config.polymer.id;
        let path = '';

        if (id && typeof id === 'string') {
            script = 'beyond.polymer.register({"' + id + '": "' + path + '"});';
        }

        resolve(script);

    });

};
