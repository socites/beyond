require('colors');

module.exports = function (application, config) {
    "use strict";

    let async = require('async');

    config = (config) ? config : {};

    Object.defineProperty(this, 'less', {
        'get': function () {
            return config.less;
        }
    });

    this.overwrites = new (require('./overwrites'))(application, config.overwrites);

    this.initialise = async(function *(resolve, reject) {
        yield this.overwrites.initialise();
    });

};
