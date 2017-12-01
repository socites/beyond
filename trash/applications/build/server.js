(function (beyond) {
    "use strict";

    let config = {
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

    let server = new beyond.Server(config, {'environment': 'development'});
    server.start();

})(require('../..'));
