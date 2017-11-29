function SNA(Controller, updateState, Actions, dependencies) {
    "use strict";

    var events = new Events({'bind': this});

    var properties = new Properties(module.control.properties);
    Object.defineProperty(this, 'properties', {
        'get': function () {
            return properties;
        }
    });

    var controller = new Controller(dependencies, properties);

    var state = new State(events, controller, properties, updateState);
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state.state;
        }
    });

    var actions = new Actions(controller, properties);
    Object.defineProperty(this, 'actions', {
        'get': function () {
            return actions;
        }
    });

}
