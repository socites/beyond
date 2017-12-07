function Factories() {
    "use strict";

    var factories = new Map();

    this.register = function (name) {

        var factory = new ItemFactory();

        if (factories.has(name)) {
            throw new Error('Factory "' + name + '" was already registered');
        }

        factories.set(name, factory);
        Object.defineProperty(this, name, {
            'get': function () {
                return factories.get(name);
            }
        });

    };

}
