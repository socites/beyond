(function (Beyond) {
    "use strict";

    let config, beyond;

    config = {
        'paths': {
            'code': './',
            'build': './deploy'
        },
        'libraries': {
            'library1': './library1/library.json'
        }
    };

    beyond = new Beyond(config, {'environment': 'development'});
    beyond.build({
        'libraries': {
            'library1': {
                'mode': 'beyond',
                'version': 'v1',
                'npm': {
                    'version': '0.1',
                    'publish': true
                },
                'path': './',
                'modules': {
                    'client': true,
                    'server': true
                }
            }
        }
    });

})(require('../..'));
