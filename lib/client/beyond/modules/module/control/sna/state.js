function State(events, controller, properties, updateState) {
    "use strict";

    var state = {};
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state;
        }
    });

    function notReady() {
        state.ready = false;
        events.trigger('change');
    }

    function update() {

        updateState(controller, state);

        if (!control.ready) {
            return notReady();
        }

        control.update(state);
        events.trigger('change');

    }

    properties.bind('change', update);
    update();

}
