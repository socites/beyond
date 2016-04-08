module.exports = function (config) {
    "use strict";

    let valid;
    Object.defineProperty(this, 'valid', {
        'get': function () {
            return valid;
        }
    });

    if (typeof config !== 'object') {
        valid = false;
        return;
    }

    let path = config.path,
        host = config.host;
    Object.defineProperty(this, 'path', {
        'get': function () {
            return path;
        }
    });

    if (host && host.substr(0, 1) !== '/') host += '/';

    Object.defineProperty(this, 'host', {
        'get': function () {
            return host;
        }
    });

    if (path && typeof path !== 'string') {
        valid = false;
        return;
    }

    if (host && typeof host !== 'string') {
        valid = false;
        return;
    }

    if (!host) host = '';
    valid = true;

};
