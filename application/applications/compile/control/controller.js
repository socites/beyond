function Controller(change, dependencies, properties, specs) {
    "use strict";

    var application;
    Object.defineProperty(this, 'application', {
        'get': function () {
            return application;
        }
    });

    Object.defineProperty(this, 'ready', {
        'get': function () {
            return !!application;
        }
    });

}
