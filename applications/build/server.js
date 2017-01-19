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
        },
        'applications': {
            'application1': './application1/application.json'
        },
        'defaults': {
            'application': 'application1',
            'language': 'eng'
        }
    };

    beyond = new Beyond(config, {'environment': 'development'});
    beyond.start();

})(require('../..'));
