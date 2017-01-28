module.exports = function () {
    "use strict";

    // check if server.json file exists
    let fs = require('fs'),
        path = require('path'),
        root = process.cwd();

    let Server = require('beyond').Server;

    let file = path.join(root, 'server.json');
    if (fs.existsSync(file)) {

        let server = new Server('server.json');
        server.start();

    }
    else {

        let config = {
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

        let server = new Server(config);
        server.start();

    }

};
