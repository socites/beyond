function ModelBase(object) {
    "use strict";

    var events = new Events({'bind': object});
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
    Object.defineProperty(object, 'ERRORS', {
        'get': function () {
            return ERRORS;
        }
    });

    var properties = new ReadOnlyProperties(this, object);
    Object.defineProperty(this, 'properties', {
        'get': function () {
            return properties;
        }
    });

    this.expose = function (name, fnc) {
        object[name] = function () {
            fnc.apply(object, [].slice.call(arguments));
        };
    };

}
