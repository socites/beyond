function ReadOnlyProperties(base, object) {
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
        Object.defineProperty(object, name, {
            'get': function () {
                return values[name];
            }
        });
        Object.defineProperty(base, name, {
            'get': function () {
                return values[name];
            }
        });

    }

    this.expose = function (list) {


        if (arguments.length > 1) {
            throw new Error('Invalid arguments');
        }

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
