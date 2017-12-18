module.exports = function (root, config, runtime) {
    "use strict";

    this.root = root;
    this.code = './';
    this.build = './build';
    this.logs = './logs';
    this.cache = './cache';

    if (!config) config = {};
    if (config.code) this.code = config.code;
    if (config.logs) this.logs = config.logs;
    if (config.cache) this.cache = config.cache;

    if (config.build) this.build = config.build;
    this.build = this.build.replace('$environment', runtime.environment);

    let resolve = require('path').resolve;

    this.code = resolve(root, this.code);
    this.build = resolve(root, this.build);
    this.logs = resolve(root, this.logs);
    this.cache = resolve(root, this.cache);

};
