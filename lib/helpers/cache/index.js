var async = require('async');

require('colors');
module.exports = function (root, config) {
    "use strict";

    if (!root) root = process.cwd();

    let fs = require('co-fs');

    let EMPTY = {};
    Object.defineProperty(this, 'EMPTY', {
        'get': function () {
            return EMPTY;
        }
    });

    let paths = {};
    Object.defineProperty(this, 'paths', {
        'get': function () {
            return paths;
        }
    });

    let Path = require('./path');
    this.push = async(function *(resolve, reject, name, path) {

        // check if directory exists
        let dirname = require('path').resolve(root, path);

        if (!(yield fs.exists(dirname))) require('./mkdir.js')({
            'path': dirname
        });

        path = new Path(dirname, EMPTY);
        paths[name] = path;
        resolve();

    });

    if (typeof config === 'object') {
        for (let path in config) this.push(path, config[path]);
    }

};
