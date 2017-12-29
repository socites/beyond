module.exports = function (config) {
    "use strict";

    if (typeof config !== 'object') {
        return;
    }

    // set hosts configuration
    if (typeof config.hosts === 'object') {
        require('./hosts.js')(this, config.hosts, config.environment);
    }

    // set logs configuration
    if (typeof config.logs === 'object') {
        require('./logs')(this, config.logs);
    }

};
