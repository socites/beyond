var async = require('async');

module.exports = async(function *(resolve, reject, application, module, language) {
    "use strict";

    if (module.custom) {

        let script = yield module.custom(language, application.template);
        resolve(script);

    }

    resolve();

});
