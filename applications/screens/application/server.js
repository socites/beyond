(function (beyond) {
    "use strict";

    let config = {
        "ports": {
            "http": "3070",
            "rpc": "3071"
        },
        'paths': {
            'code': './'
        },
        'applications': {
            'screens': './application.json'
        },
        'libraries': {
            "screens": '../library/library.json'
        },
        'defaults': {
            'application': 'screens',
            'language': 'eng'
        }
    };

    let server = new beyond.Server(config, {'environment': 'development'});
    server.start();

})(require('../../..'));
