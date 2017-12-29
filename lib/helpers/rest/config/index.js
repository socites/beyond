require('colors');
module.exports = function (root, config, environment) {
    "use strict";

    Object.defineProperty(this, 'logs', {
        'get': function () {
            return config.logs;
        }
    });

    if (typeof config === 'string') {

        config = require('./read.js')(root, config);
        if (!config) {
            this.valid = false;
            return;
        }

        this.root = config.dirname;

    }
    else {
        this.root = root;
    }
    delete config.dirname;


    // set hosts configuration
    if (typeof config.hosts !== 'object') {
        delete config.hosts;
    }
    else {
        require('./hosts')(this, config.hosts, environment);
    }

    // set logs configuration
    if (typeof config.logs !== 'object') {
        delete config.logs;
    }
    else {
        require('./logs')(this, config.logs);
    }

};
