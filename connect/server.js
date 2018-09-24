(function (beyond) {
    'use strict';

    let config = {
        'ports': {
            'http': '3020',
            'rpc': '3021'
        },
        'paths': {
            'code': './'
        },
        'applications': {
            'connect-tests': './application.json'
        },
        'libraries': {
            'connect': './library/library.json'
        },
        'types': [
            '../types'
        ],
        'defaults': {
            'application': 'connect-tests',
            'language': 'eng'
        },
        'services': {
            'common': {'hello': 'world'}
        }
    };

    let server = new beyond.Server(config, {'environment': 'development'});
    server.start();

})(require('..'));
