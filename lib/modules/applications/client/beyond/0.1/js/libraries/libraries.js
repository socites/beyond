var Libraries = function (beyond) {
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

    this.get = function (name) {

        if (items[name]) return items[name];

        var library = new Library(beyond, name);
        items[name] = library;
        keys.push(name);

        return library;

    };

};
