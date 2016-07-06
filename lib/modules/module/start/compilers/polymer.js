var async = require('async');

module.exports = function (module, config) {
    "use strict";

    return async(function *(resolve, reject, language, overwrites) {

        resolve('// beyond.polymer.register({' + '});');

    });

};
