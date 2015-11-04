var async = require('async');

module.exports = async(function *(resolve, reject, module, language, overwritesConfig) {
    "use strict";

    if (module.custom) {

        let overwrites = require('./overwrites')(overwritesConfig, module.ID);
        let script = yield module.custom(language, overwrites);
        resolve(script);

    }

    resolve();

});
