require('colors');
module.exports = function () {
    "use strict";

    let root, config;
    if (arguments.length === 2) {
        root = arguments[0];
        config = arguments[1];
    }
    else if (arguments.length === 1) {
        root = process.cwd();
        config = arguments[0];
    }
    else throw new Error('invalid parameters');

    config = new (require('./config'))(root, config);

    let async = require('async');
    let fs = require('fs');

    let ids = {};

    // to inform an invalid configuration only once
    let errors = {};
    let report = function (path) {

        if (errors[path]) {
            return;
        }
        errors[path] = true;
        console.log('log configuration "' + path + '" is not specified');

    };

    /*
     * System log
     * @param mixed $text string or array text to be written in the log
     * @param string $log string log to be written on
     * @return null
     */
    this.save = async(function *(resolve, reject, text, path) {

        let file = config.paths[path];
        if (!file) {
            report(path);
            resolve(-1);
            return;
        }

        if (!ids[path]) ids[path] = 0;
        ids[path]++;

        let id = ids[path];

        text = '----------------\n'.bold +
            ('ID: ' + id).inverse +
            '\n----------------\n'.bold + text;

        fs.appendFile(file, '\n' + text + '\n', function (error) {
            if (error) console.log('error saving on log file"'.red + (file).red.bold + '"'.red);
        });

        resolve(id);

    });

};
