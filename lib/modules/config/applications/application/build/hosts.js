module.exports = function (application, config, runtime) {
    "use strict";

    if (typeof config === 'string') {
        config = {
            'production': config,
            'development': config
        };
    }

    if (config && typeof config !== 'object') {
        console.log('Invalid hosts specification on application "'.red +
            (application.name).bold.red + '".'.red);
        return;
    }

    if (config && typeof config.js === 'string') {

        if (!config.production) config.production = {};
        if (!config.development) config.development = {};

        let host = config.js;
        config.production.js = host;
        config.development.js = host;

    }

    if (config && typeof config.ws === 'string') {

        if (!config.production) config.production = {};
        if (!config.development) config.development = {};

        let host = config.ws;
        config.production.ws = host;
        config.development.ws = host;

    }

    let hosts;
    if (!config) {
        hosts = {'js': ''};
        if (application.connect) hosts.ws = '/' + application.name;
    }
    else {
        hosts = config[runtime.environment];
        if (typeof hosts !== 'string') hosts = '';
    }

    if (typeof hosts === 'string') {

        let host = hosts;

        hosts = {};
        hosts.js = host;

        if (application.connect) {

            let url = require('url').parse(hosts.js);
            hosts.ws = url.protocol + '//' + url.hostname + '/' + application.name;

        }

    }

    if (typeof hosts !== 'object' ||
        typeof hosts.js !== 'string' ||
        (application.connect && typeof hosts.ws !== 'string')) {

        console.log('Invalid build hosts "'.red + (runtime.environment).bold.red +
            '" on application "'.red + (application.name).bold.red + '".'.red)
        return;

    }

    if (hosts.js && hosts.js.substr(hosts.js - 1) !== '/') {
        hosts.js += '/';
    }

    if (!application.connect) {
        delete hosts.ws;
    }

    return hosts;

};
