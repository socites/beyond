function ReadOnlyProperties(model) {
    "use strict";

    var props = this;

    var values = {};

    function expose(name) {

        Object.defineProperty(props, name, {
            'get': function () {
                return values[name];
            },
            'set': function (value) {
                values[name] = value;
            }
        });
        Object.defineProperty(model, name, {
            'get': function () {
                return values[name];
            }
        });

    }

    this.expose = function (list) {

        if (typeof list === 'string') {
            list = [list];
        }

        if (!(list instanceof Array)) {
            throw new Error('Invalid arguments');
        }

        for (var index in list) {
            expose(list[index]);
        }

    };

}

window.Properties = {'ReadOnly': ReadOnlyProperties};
