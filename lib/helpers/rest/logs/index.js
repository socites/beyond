module.exports = function (root, config) {
    "use strict";

    let messages = require('./messages.js');
    let logs = new (require('logs'))(root, config);

    let async = require('async');

    this.save = async(function *(resolve, reject, params, messageID, log) {

        try {

            let message = messages(messageID, params);
            let id = yield logs.save(message, log);

            resolve(id);

        }
        catch (exc) {
            console.log(exc.stack);
            resolve();
        }

    });

};
