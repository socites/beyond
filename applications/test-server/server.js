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
        'libraries': {
            'tests': './library/library.json'
        },
        'applications': {
            'test-server': './application.json'
        },
        'defaults': {
            'application': 'test-server',
            'language': 'eng'
        }
    };

    let server = new beyond.Server(config, {'environment': 'development'});
    server.start();

})(require('../..'));
