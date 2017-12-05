function ReadOnlyProperties(model) {
    "use strict";

    var props = {};

    function expose(name) {

        Object.defineProperty(this, name, {
            'get': function () {
                return props[name];
            },
            'set': function (value) {
                props[name] = value;
            }
        });
        Object.defineProperty(model, name, {
            'get': function () {
                return props[name];
            }
        });

    }

    this.expose = function (list) {

        for (var index in list) {
            expose(list[index]);
        }

    };

}

window.Properties = {'ReadOnly': ReadOnlyProperties};
