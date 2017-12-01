(function (beyond) {
    "use strict";

    let config = {
        "ports": {
            "http": "3020",
            "rpc": "3021"
        },
        'paths': {
            'code': './'
        },
        'applications': {
            'beyond': './application.json'
        },
        'types': [
            '../types'
        ],
        'defaults': {
            'application': 'beyond',
            'language': 'eng'
        }
    };

    let server = new beyond.Server(config, {'environment': 'development'});
    server.start();

})(require('..'));
