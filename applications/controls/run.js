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
            'beyond': './application.json'
        },
        'defaults': {
            'application': 'beyond',
            'language': 'en'
        }
    };

    let beyond = new Beyond(config, {'environment': 'development'});
    beyond.start();

})(require('../..'));
