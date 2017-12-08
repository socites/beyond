function Controller(change, dependencies, properties, specs) {
    "use strict";

    var libraries = dependencies.beyond.libraries;
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return libraries;
        }
    });

    libraries.bind('change', change);
    if (!libraries.loaded) {
        libraries.load({'items': true});
    }

    Object.defineProperty(this, 'ready', {
        'get': function () {
            return true;
        }
    });

}
