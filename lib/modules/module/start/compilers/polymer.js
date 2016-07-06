var async = require('async');

module.exports = function (module, config) {
    "use strict";

    return async(function *(resolve, reject, language, overwrites) {

        if (!config.polymer.id) {
            resolve();
            return;
        }

        let control = module.ID + '.html';

        let script;
        script = 'beyond.polymer.register({"' + config.polymer.id + '": "' + control + '"});';

        resolve(script);

    });

};
