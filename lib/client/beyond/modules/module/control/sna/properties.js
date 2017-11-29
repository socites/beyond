function Properties(props) {
    "use strict";

    var events = new Events({'bind': this});

    var values = {};

    var exposeProperty = Delegate(this, function (name) {

        Object.defineProperty(this, name, {
            'get': function () {
                return values[name];
            },
            'set': function (value) {

                if (values[name] === value) {
                    return;
                }

                values[name] = value;
                events.trigger('change');

            }
        });

    });

    for (var name in props) {
        exposeProperty(name);
    }

    this.updateState = function (state) {

        if (!state.properties) {
            state.properties = {};
        }

        var properties = state.properties;
        for (var name in props) {
            properties[name] = values[name];
        }

    };

}
