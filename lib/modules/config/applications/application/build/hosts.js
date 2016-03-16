module.exports = function (application, config, specs) {
    "use strict";

    if (typeof config === 'string') {
        config = {
            'production': config,
            'development': config
        };
    }

    if (config && typeof config !== 'object') {
        console.log('invalid hosts specification on application "'.red +
            (application.name).bold.red + '"'.red)
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
        hosts = {'js': '/'};
        if (application.connect) hosts.ws = '/' + application.name;
    }
    else {
        hosts = config[specs.environment];
        if (!hosts) hosts = '/';
    }

    if (typeof hosts === 'string') {

        hosts = {'js': hosts};
        if (application.connect) {

            let url = require('url').parse(hosts.js);
            let host = url.protocol + '//' + url.hostname + '/' + application.name;
            hosts.ws = host;

        }

    }

    if (typeof hosts !== 'object' ||
        typeof hosts.js !== 'string' ||
        (application.connect && typeof hosts.ws !== 'string')) {

        console.log('invalid build hosts "'.red + (specs.environment).bold.red + '" on application "'.red + (application.name).bold.red + '"'.red)
        return;

    }

    return hosts;

};
