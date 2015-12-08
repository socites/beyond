var Routes = function (config) {
    "use strict";

    var events = new Events({'bind': this});

    var items = {};
    var keys = [];
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });
    Object.defineProperty(this, 'length', {
        'get': function () {
            return keys.length;
        }
    });

    for (var pathname in config) {

        if (typeof config[pathname] === 'string') items[pathname] = {'moduleID': config[pathname]};
        else items[pathname] = config;

        keys.push(pathname);

    }

    this.register = function (pathname, route) {

        if (items[pathname]) return;

        items[pathname] = items[route];
        keys.push(pathname);

    };

    var errors = [];

    this.get = function (pathname, state, callback) {

        if (errors.indexOf(pathname) !== -1) {
            callback();
            return;
        }

        var route = beyond.routes.items[pathname];
        if (route) {
            callback(route, state);
            return;
        }

        events.trigger({'event': 'routing', 'async': true}, pathname, state, function (route, state) {

            if (!route) {

                errors.push(pathname);
                callback();
                return;

            }

            callback(route, state);

        });

    };

};
