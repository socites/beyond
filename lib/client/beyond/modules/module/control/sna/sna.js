function SNA(behaviour, specs, creator, props, dependencies) {
    "use strict";

    var events = new Events({'bind': this});

    var properties = new Properties(behaviour, props);
    Object.defineProperty(this, 'properties', {
        'get': function () {
            return properties;
        }
    });

    var controller = new Controller(specs.Controller, dependencies, properties, creator);

    var state = new State(events, controller, properties, specs.updateState);
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state.state;
        }
    });

    var actions = new specs.Actions(controller.controller, properties);
    Object.defineProperty(this, 'actions', {
        'get': function () {
            return actions;
        }
    });

}
