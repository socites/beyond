module.exports = function () {
    "use strict";


    // check if server.json file exists
    var fs = require('fs'),
        path = require('path'),
        root = process.cwd();

    var file = path.join(root, 'server.json');
    if (fs.existsSync(file)) {
        beyond.start('server.json');
    }
    else {

        var config = {
            'paths': {
                'code': './',
                'build': './build'
            },
            'defaults': {
                'application': 'default',
                'language': 'en'
            }
        };

        // check if application configuration exists
        // in this case, beyond will not serve other applications, or any library
        file = path.join(root, 'application.json');
        if (fs.existsSync(file)) {

            config.applications = {
                'default': './application.json'
            };

        }
        else {

            config.applications = {
                'default': {
                    "version": "0.1",
                    "static": [
                        'index.html'
                    ]
                }
            }

        }

        // start beyond server
        var Beyond = require('beyond');
        var beyond = new Beyond(config);

        beyond.start();

    }

};
