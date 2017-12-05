function Controller(change, dependencies, properties, specs) {
    "use strict";

    Object.defineProperty(this, 'beyond', {
        'get': function () {
            return dependencies.beyond;
        }
    });

    Object.defineProperty(this, 'ready', {
        'get': function () {
            return true;
        }
    });

}
