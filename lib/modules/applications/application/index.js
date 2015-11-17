module.exports = function (name, libraries, config, runtime) {
    "use strict";

    this.name = name;
    this.dirname = config.dirname;

    if (config.static) this.static = new (require('./static'))(this, config.static, runtime);

    Object.defineProperty(this, 'version', {
        'get': function () {
            return config.version;
        }
    });

    this.hosts = require('./hosts.js')(this, libraries, config, runtime);

    // set application.routes property
    require('./routes.js')(this);

    this.modules = new (require('./modules'))(this, libraries, runtime);
    this.libraries = new (require('./libraries'))(this, config.imports, libraries, runtime);
    this.plugins = config.plugins;

    this.client = new (require('./client'))(this, config, runtime);

    Object.defineProperty(this, 'params', {
        'get': function () {
            if (typeof config.params !== 'object') return {};
            return config.params;
        }
    });

    Object.defineProperty(this, 'css', {
        'get': function () {
            return config.css;
        }
    });

    Object.defineProperty(this, 'overwrites', {
        'get': function () {
            return config.overwrites;
        }
    });

    Object.defineProperty(this, 'build', {
        'get': function () {
            return config.build;
        }
    });

    this.valid = true;

};
