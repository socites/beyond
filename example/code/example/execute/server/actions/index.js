var async = require('async');

module.exports = function (runtime, config, backend) {
    "use strict";

    this.timer = 10;
    this.welcome = async(function *(resolve, reject, params, socket, context) {

        let message = backend.message;
        if (config.uppercase) message = message.toUpperCase();

        setTimeout(function () {
            resolve(message);
        }, this.timer);

    }, this);

};
