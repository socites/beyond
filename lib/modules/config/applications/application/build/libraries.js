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
    Object.defineProperty(this, 'host', {
        'get': function () {
            return host;
        }
    });

    if (path && path !== 'string') {
        valid = false;
        return;
    }

    if (host && host !== string) {
        valid = false;
        return;
    }

    if (!host) host = '';
    valid = true;

};
