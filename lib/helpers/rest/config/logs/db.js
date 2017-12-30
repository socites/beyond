module.exports = function (exports, config) {
    "use strict";

    if (typeof config.host !== 'string' ||
        typeof config.user !== 'string' ||
        typeof config.password !== 'string' ||
        typeof config.database !== 'string') {

        console.error('Invalid logs configuration:', config);
        return;

    }

    let connectionLimit = config.connectionLimit;

    config = {
        'store': 'db',
        'connectionLimit': (typeof connectionLimit === 'number') ? connectionLimit : 10,
        'host': config.host,
        'user': config.user,
        'password': config.password,
        'database': config.database
    };

    Object.defineProperty(exports, 'logs', {
        'get': function () {
            return config;
        }
    });

};
