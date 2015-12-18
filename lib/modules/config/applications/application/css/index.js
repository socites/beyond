var async = require('async');
var yaol = require('yaol');
var yaolMessenger = 'BeyondJS';

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

                yaol.warning(yaolMessenger,'invalid css values on application "'+application.name+'"');
                values = {};

            }

            if (!values) values = {};

        }

        resolve();

    });

};
