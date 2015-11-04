var ControlsCollection = function () {
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

    this.push = function (item) {

        if (typeof item !== 'object' || typeof item.pathname !== 'string') {
            console.error('invalid arguments');
            return;
        }

        var pathname = item.pathname;
        if (keys.indexOf(pathname) === -1) keys.push(pathname);
        items[pathname] = item;

        return item;

    };

    this.exists = function (pathname) {
        return !!items[pathname];
    };

};
