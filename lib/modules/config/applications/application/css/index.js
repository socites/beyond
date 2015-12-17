var async = require('async');
var output = require('../../../../../config/output');

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

                output.warning('invalid css values on application "'+application.name+'"');
                values = {};

            }

            if (!values) values = {};

        }

        resolve();

    });

};
