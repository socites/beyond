module.exports = function (version, library, config, runtime) {
    "use strict";

    if (typeof config === 'string') {
        config = {
            'production': config,
            'development': config
        };
    }

    if (config && typeof config !== 'object') {
        console.log('Invalid hosts specification on library "'.red +
            (library.name).bold.red + '", version "'.red + (version.version).red.bold + '".'.red)
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
        hosts = {};
    }
    else {
        hosts = config[runtime.environment];
        if (!hosts) {
            hosts = {};
        }
    }

    if (!hosts.js) {
        hosts.js = '/libraries/' + library.name;
    }
    if (!hosts.ws) {
        hosts.ws = '/libraries/' + library.name;
    }

    if (typeof hosts === 'string') {

        let host = hosts;

        hosts = {};
        hosts.js = host;

        if (library.connect) {
            let url = require('url').parse(host);
            hosts.ws = 'ws://' + url.hostname + '/' + library.name;
        }

    }

    if (typeof hosts !== 'object') {
        console.log('Invalid hosts "'.red + (runtime.environment).bold.red +
            '" specification on library "'.red + (library.name).bold.red + '". Hosts must be an object.'.red)
        return;
    }

    if (typeof hosts.js !== 'string') {
        console.log('Invalid hosts "'.red + (runtime.environment).bold.red +
            '" specification on library "'.red + (library.name).bold.red + '". Host JS is invalid or not specified.'.red)
        return;
    }

    if (library.connect && typeof hosts.ws !== 'string') {
        console.log('Invalid hosts "'.red + (runtime.environment).bold.red +
            '" specification on library "'.red + (library.name).bold.red + '". Host WS is invalid or not specified.'.red)
        return;
    }

    hosts.js = hosts.js.replace('$version', version.version);
    if (library.connect) hosts.ws = hosts.ws.replace('$version', version.version);
    else delete hosts.ws;

    if (hosts.js && hosts.js.substr(hosts.js.length - 1) !== '/') hosts.js += '/';

    return hosts;

};
