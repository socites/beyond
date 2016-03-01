var async = require('async');

module.exports = function (module, config) {
    "use strict";

    let code = require('../../code/index');

    return async(function *(resolve, reject, language, overwrites) {

        resolve(yield code(module, config, language, overwrites));

    });

};
