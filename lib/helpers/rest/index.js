module.exports = function (config) {
    "use strict";

    config = new (require('./config'))(config);

    // Set logs
    let logs = new (require('./logs'))(config.logs);
    this.Request = require('./request.js')(config.hosts, logs);

};
