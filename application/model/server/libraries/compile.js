module.exports = require('async')(function *(resolve, reject, params, context) {
    "use strict";

    if (!params.library) {
        throw new Error('Invalid parameter "library"');
    }

    let builder = require('path').join(require('main.lib'), 'builder/');
    builder = require(builder);

    let specs = {
        'libraries': {
            [params.library]: {
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

    let socket = context.socket;

    builder.on('message', function (message) {
        socket.emit('build.libraries.' + params.library, {
            'type': 'message',
            'message': message
        });
    });
    builder.on('error', function (message) {
        socket.emit('build.libraries.' + params.library, {
            'type': 'error',
            'message': message
        });
    });

    yield builder.build('./build', context.modules, specs, runtime);
    resolve();

});
