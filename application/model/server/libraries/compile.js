module.exports = require('async')(function *(resolve, reject, params, context) {
    "use strict";

    let builder = require('path').join(require('main.lib'), 'builder/');
    builder = require(builder);

    let specs = {
        'libraries': {
            'beyond': {
                'client': false,
                'server': true,
                'mode': 'beyond',
                'npm': {
                    'version': '0.1'
                },
                'path': './',
                'modules': {
                    'client': true,
                    'server': true
                }
            }
        }
    };

    let runtime = 'development';

    builder.on('message', function (message) {
        console.log('message from builder', message);
    });
    builder.on('error', function (message) {
        console.log('error from builder', message);
    });

    yield builder.build('./build', context.modules, specs, runtime);
    resolve();

});
