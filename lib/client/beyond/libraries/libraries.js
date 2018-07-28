let Libraries = function (beyond) {
    'use strict';

    let libraries = new Map();
    Object.defineProperty(this, 'values', {
        'get': () => libraries.values()
    });
    Object.defineProperty(this, 'keys', {
        'get': () => libraries.keys()
    });
    Object.defineProperty(this, 'size', {
        'get': () => libraries.size
    });

    this.has = function (name) {
        return libraries.has(name);
    };

    this.get = function (name) {

        if (libraries.has(name)) {
            return libraries.get(name);
        }

        let library = new Library(beyond, name);
        libraries.set(name, library);

        return library;

    };

};
