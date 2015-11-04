var async = require('async');

require('colors');
module.exports = function (application, config) {
    "use strict";

    let values;
    Object.defineProperty(this, 'values', {
        'get': function () {
            return values;
        }
    });

    if (!config) config = {};
    values = config.values;

    this.initialise = async(function *(resolve, reject) {

        if (typeof values === 'string') {

            values = yield require('./read.js')(application, values);
            if (!values) values = {};

        }
        else if (!values) {
            values = {};
        }
        else {

            if (typeof values !== 'object') {

                let message = 'invalid css values on application "'.yellow +
                    (application.name).yellow.bold + '"'.yellow;

                console.log(message);
                values = {};

            }

            if (!values) values = {};

        }

        resolve();

    });

};
