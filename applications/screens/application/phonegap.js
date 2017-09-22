(function (beyond) {
    "use strict";

    let config = {
        'paths': {
            'code': './',
            'build': './phonegap'
        },
        'applications': {
            'screens': './application.json'
        },
        'libraries': {
            "screens": '../library/library.json'
        }
    };

    let builder = new beyond.Builder(config, {'environment': 'development'});
    builder.build({
        'applications': {
            'screens': {
                'client': {'mode': 'phonegap'},
                'languages': 'spa'
            }
        }
    });

})(require('../../..'));
