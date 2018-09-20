require('colors');
module.exports = function (root, config) {
    'use strict';

    let paths = {};
    Object.defineProperty(this, 'paths', {
        'get': function () {
            return paths;
        }
    });

    if (typeof config === 'string') {

        config = require('./read.js')(root, config);
        if (!config) {
            this.valid = false;
            return;
        }

        this.root = config.dirname;

    }
    else {
        this.root = root;
    }
    delete config.dirname;


    let fs = require('fs');
    for (let path in config) {

        if (typeof config[path] !== 'string') {
            console.error('invalid path on log configuration "'.red + (path).bold.red + '"'.red);
            continue;
        }

        // check if directory exists
        let log = require('path').resolve(this.root, config[path]);
        let dirname = require('path').dirname(log);

        if (!fs.existsSync(dirname)) require('./mkdir.js')({
            'path': dirname
        });

        // check if file exists
        if (!fs.existsSync(log)) {

            // create it
            fs.closeSync(fs.openSync(log, 'w'));

        }
        else {

            // check that the configured file is effectively a file
            if (!fs.statSync(log).isFile()) {
                console.error('log configuration "'.red + (log).bold.red + '" points to a resource that is not a file'.red);
                continue;
            }

        }

        paths[path] = log;

    }

};
