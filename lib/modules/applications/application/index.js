module.exports = function (name, libraries, config, runtime) {
    "use strict";

    this.name = name;
    this.dirname = config.dirname;

    if (config.static) {
        this.static = new (require('./static'))(this, config.static, runtime);
    }

    Object.defineProperty(this, 'version', {
        'get': function () {
            return config.version;
        }
    });

    this.hosts = require('./hosts.js')(this, libraries, config, runtime);

    this.modules = new (require('./modules'))(this, libraries, runtime);
    this.libraries = new (require('./libraries'))(this, config.imports, libraries, runtime);
    this.plugins = config.plugins;

    this.client = new (require('./client'))(this, config, runtime);

    this.ws = config.ws;

    Object.defineProperty(this, 'params', {
        'get': function () {

            var params = config.params;
            if (typeof params !== 'object') params = {};

            params.environment = runtime.environment;

            return params;

        }
    });

    Object.defineProperty(this, 'css', {
        'get': function () {
            return config.css;
        }
    });

    Object.defineProperty(this, 'template', {
        'get': function () {
            return config.template;
        }
    });

    Object.defineProperty(this, 'build', {
        'get': function () {
            return config.build;
        }
    });

    Object.defineProperty(this, 'connect', {
        'get': function () {
            return config.connect;
        }
    });

    this.valid = true;

};
