function ModelBase(collection) {
    "use strict";

    var events = new Events({'bind': model});
    Object.defineProperty(this, 'events', {
        'get': function () {
            return events;
        }
    });

    var ERRORS = Object.freeze({
        'NONE': 0,
        'INVALID_RESPONSE': 1
    });
    Object.defineProperty(this, 'ERRORS', {
        'get': function () {
            return ERRORS;
        }
    });
    Object.defineProperty(collection, 'ERRORS', {
        'get': function () {
            return ERRORS;
        }
    });

    var properties = new ReadOnlyProperties(collection);
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
