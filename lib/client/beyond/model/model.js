function ModelBase(model) {
    "use strict";

    var events = new Events({'bind': model});
    Object.defineProperty(this, 'events', {
        'get': function () {
            return events;
        }
    });

    var properties = new ReadOnlyProperties();
    Object.defineProperty(this, 'properties', {
        'get': function () {
            return properties;
        }
    });

    this.expose = function (name, fnc) {
        model[name] = fnc;
    };

}

window.ModelBase = ModelBase;
