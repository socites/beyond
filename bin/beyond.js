#!/usr/bin/env node

var beyond = require('beyond');

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
                "static": [
                    'index.html'
                ]
            }
        }

    }

    beyond.start(config);

}
