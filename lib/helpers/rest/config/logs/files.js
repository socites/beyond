module.exports = function (exports, config) {
    "use strict";

    if (typeof config.calls !== 'string' && typeof config.errors !== 'string') {
        console.error('Invalid logs configuration:', config);
        return;
    }

    if (typeof config.calls !== 'string') {
        console.warn('Rest calls logs not configured');
    }
    if (typeof config.errors !== 'string') {
        console.warn('Rest errors logs not configured');
    }

    Object.defineProperty(exports, 'config', {
        'get': function () {
            return config;
        }
    });

};
