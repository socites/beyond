require('colors');
module.exports = function (library, buildPath, config, specs) {
    "use strict";

    if (!config) config = {};

    let path = config.path;
    if (!path) path = library.name;

    this.js = require('path').resolve(buildPath, 'js', path);
    this.ws = require('path').resolve(buildPath, 'ws', path);

};
