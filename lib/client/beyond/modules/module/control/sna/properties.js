function Properties(behaviour, props) {
    "use strict";

    var events = new Events({'bind': this});

    var values = {};

    var silence;
    Object.defineProperty(this, 'silence', {
        'get': function () {
            return !!silence;
        },
        'set': function (value) {
            silence = !!value;
        }
    });

    this.refresh = function () {
        this.updateControl();
        events.trigger('change');
    };

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

                this.updateControl();

                if (!silence) {
                    events.trigger('change');
                }

            }
        });

    });

    for (var name in props) {
        exposeProperty(name);
    }

    this.updateControl = function () {

        for (var name in values) {

            var spec = props[name];
            var value = values[name];

            if (value === behaviour[name]) {
                continue;
            }

            if (spec.readOnly) {

                var method = '_set' +
                    name.substr(0, 1).toUpperCase() +
                    name.substr(1);

                behaviour[method](value);

            }
            else {
                behaviour[name] = value;
            }

        }

    };

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
