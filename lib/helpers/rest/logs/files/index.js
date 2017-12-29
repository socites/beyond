module.exports = function (config) {
    "use strict";

    let ids = {};
    if (config.calls) ids.calls = config.calls;
    if (config.errors) ids.errors = config.errors;

    let logs = new (require('../../../logs'))(ids);

    this.save = function () {

        let log, messageID;
        if (params.requestError) {
            log = 'errors';
            messageID = 'request_error';
        }
        else if (params.statusCode !== 200) {
            log = 'errors';
            messageID = 'response';
        }
        else if (!params.responseData) {
            log = 'errors';
            messageID = 'empty_response';
        }
        else if (params.parseError) {
            log = 'errors';
            messageID = 'invalid_response';
        }
        else if (params.responseStatus !== 'ok') {
            log = 'errors';
            messageID = 'error';
        }
        else {
            log = 'calls';
            messageID = 'response';
        }

        let message = require('./messages.js')(messageID, params);

    };

};
