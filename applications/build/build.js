(function (beyond) {
    "use strict";

    let config;

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
        }
    };

    let builder = new beyond.Builder(config, {'environment': 'development'});

    function buildLibraries() {

        builder.build({
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

    }

    builder.build({
        'applications': {
            'application1': {
                'mode': 'phonegap'
            }
        }
    });

})(require('../..'));
