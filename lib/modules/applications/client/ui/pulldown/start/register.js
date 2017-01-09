if (!beyond.ui) {
    beyond.ui = {};
}
beyond.ui.PullDown = function (id, dependencies, createFnc, properties) {
    "use strict";

    if (typeof id !== 'string' ||
        typeof dependencies !== 'object' ||
        typeof createFnc !== 'function' ||
        (properties && typeof properties !== 'object')) {

        throw new Error('Invalid parameters');
    }

    var def = {
        'is': id,
        'created': function () {
            this.control = new Control(this, dependencies, createFnc);
        },
        'ready': function () {
            this.control.host = this;
        },
        'attached': function () {
            this.control.active = this.active;
        }
    };

    if (!properties) {
        properties = {};
    }

    for (var name in properties) {

        if (typeof name !== 'string' ||
            typeof properties[name] !== 'object' ||
            typeof properties[name].observer !== 'function') {

            console.error('Invalid property definition');
            continue;
        }

        var observerName = 'set' + name.substr(0, 1).toUpperCase() + name.substr(1);
        (function (name, observer) {

            def[name] = function (value) {
                observer.call(this, value);
            };

        })(observerName, properties[name].observer);

        properties[name] = {
            'type': properties[name].type,
            'observer': observerName
        }

    }

    properties.parentScroller = {
        'type': Object,
        'observer': 'setParentScroller'
    };

    properties.pulled = {
        'type': Boolean,
        'observer': 'setPulled'
    };

    properties.overwriteScroller = {
        'type': Boolean
    };

    def.setParentScroller = function (scroller) {
        this.control.parentScroller = scroller;
    };

    def.setPulled = function (pulled) {
        this.control.pulled = pulled;
    };

    def.properties = properties;

    Polymer(def);

    return def;

};
