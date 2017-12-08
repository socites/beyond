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

    yield builder.build('./build', context.modules, specs, runtime);
    resolve();

});
