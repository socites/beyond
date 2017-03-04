require('colors');
module.exports = function (library, buildPath, config, runtime) {
    "use strict";

    if (!config) config = {};

    let path = config.path;
    if (!path) path = library.name;

    Object.defineProperty(this, 'path', {
        'get': function () {
            return path;
        }
    });

    this.js = require('path').resolve(buildPath, 'libraries/client', path);
    this.ws = require('path').resolve(buildPath, 'libraries/server', path);

};
