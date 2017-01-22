(function (Beyond) {
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
            'controls': './application.json'
        },
        'defaults': {
            'application': 'controls',
            'language': 'eng'
        }
    };

    let beyond = new Beyond(config, {'environment': 'development'});
    beyond.start();

})(require('../..'));
