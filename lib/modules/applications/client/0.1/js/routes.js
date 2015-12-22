var Routes = function (config) {
    "use strict";

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
        else items[pathname] = config[pathname];

        keys.push(pathname);

    }

    this.register = function (pathname, route) {

        if (items[pathname]) return;

        items[pathname] = items[route];
        keys.push(pathname);

    };

};
