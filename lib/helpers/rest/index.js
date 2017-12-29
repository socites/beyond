module.exports = function (paths, config, environment) {
    "use strict";

    if (typeof paths === 'string') paths = {
        'config': paths,
        'logs': paths
    };

    config = new (require('./config'))(paths.config, config, environment);

    // Set logs
    let configLogs = (config.logs) ? config.logs : {'calls': './calls', 'errors': './errors'};
    let logs = new (require('./logs'))(paths.logs, configLogs);

    this.Request = require('./request.js')(config, environment, logs);

};
