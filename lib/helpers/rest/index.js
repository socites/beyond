module.exports = function (paths, config, environment) {
    "use strict";

    if (typeof paths === 'string') paths = {
        'config': paths,
        'logs': paths
    };

    config = new (require('./config'))(paths.config, config, environment);

    let logs = {'calls': './calls', 'errors': './errors'};
    if (config.logs) logs = config.logs;
    logs = new (require('./logs'))(paths.logs, logs);

    this.Request = require('./request.js')(config, environment, logs);

};
