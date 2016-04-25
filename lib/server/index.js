require('colors');
module.exports = new (function () {
    "use strict";

    let http;
    let rpc;

    let ports;
    Object.defineProperty(this, 'ports', {
        'get': function () {
            return ports;
        }
    });

    this.start = function (config, modules, runtime) {

        if (!config.valid) return;

        ports = {'http': config.ports.http, 'rpc': config.ports.rpc};

        // the http server
        http = require('./http')(ports.http, modules, {
            'local': runtime.local,
            'environment': runtime.environment,
            'defaults': config.modules.defaults
        });

        let specs = {
            'local': runtime.local,
            'paths': config.modules.paths,
            'port': ports.rpc,
            'environment': runtime.environment
        };

        // the rpc server
        if (ports.http === ports.rpc) {

            specs.server = http;
            rpc = require('./rpc')(modules, specs, runtime);

        }
        else {
            rpc = require('./rpc')(modules, specs, runtime);
        }

    };

});
