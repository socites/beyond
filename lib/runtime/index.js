module.exports = function (specs) {
    "use strict";

    if (!specs) specs = {};

    Object.defineProperty(this, 'offline', {
        'get': function () {
            return !!specs.offline;
        }
    });

    Object.defineProperty(this, 'local', {
        'get': function () {
            if (typeof specs.local === 'undefined') {
                return true;
            }
            return !!specs.local;
        }
    });

    Object.defineProperty(this, 'environment', {
        'get': function () {

            let environment = specs.environment;

            if (['development'].indexOf(environment) === -1)
                environment = 'production';

            return environment;

        }
    });

    let paths;
    Object.defineProperty(this, 'paths', {
        'get': function () {
            return paths;
        },
        'set': function (value) {
            paths = value;
        }
    });

    Object.defineProperty(this, 'build', {
        'get': function () {
            return specs.build;
        }
    });

};
