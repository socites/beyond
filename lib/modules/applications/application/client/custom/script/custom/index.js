var async = require('async');

module.exports = async(function *(resolve, reject, module, language, template) {
    "use strict";

    if (module.custom) {

        let overwrites = require('./overwrites')(module.ID, template.overwrites);
        let script = yield module.custom(language, {
            'globals': {
                'less': template.less
            },
            'overwrites': overwrites
        });
        resolve(script);

    }

    resolve();

});
