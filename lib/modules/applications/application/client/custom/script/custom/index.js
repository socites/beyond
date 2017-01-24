var async = require('async');

module.exports = async(function *(resolve, reject, module, language, template) {
    "use strict";

    if (module.custom) {

        let script = yield module.custom(language, template);
        resolve(script);

    }

    resolve();

});
