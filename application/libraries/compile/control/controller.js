function Controller(change, dependencies, properties, specs) {
    "use strict";

    var library;
    Object.defineProperty(this, 'library', {
        'get': function () {
            return library;
        }
    });

    Object.defineProperty(this, 'ready', {
        'get': function () {
            return (!!library && library.loaded);
        }
    });

    this.update = function () {

        if (!properties.library) {
            library = undefined;
            change();
            return;
        }

        if (library && library.id === properties.library) {
            return;
        }

        var libraries = dependencies.beyond.factories.libraries;

        library = libraries.get(properties.library);
        library.bind('change', change);

        library.load();

    };

}
