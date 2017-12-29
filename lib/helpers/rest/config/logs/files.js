module.exports = function (exports, config) {
    "use strict";

    if (typeof config.calls !== 'string' && typeof config.errors !== 'string') {
        console.error('Invalid logs configuration:', config);
        return;
    }

    if (typeof config.calls !== 'string') {
        console.warn('Rest calls logs not configured');
        config.calls = undefined;
    }
    if (typeof config.errors !== 'string') {
        console.warn('Rest errors logs not configured');
        config.errors = undefined;
    }

    Object.defineProperty(exports, 'logs', {
        'get': function () {
            return {
                'store': 'files',
                'calls': config.calls,
                'errors': config.errors
            };
        }
    });

};
