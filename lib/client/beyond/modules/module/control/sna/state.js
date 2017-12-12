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

        if (!controller.controller.ready) {
            return notReady();
        }

        state.ready = true;

        updateState(controller.controller, state, properties);
        properties.updateState(state);
        events.trigger('change');

    }

    var timer;

    function _update() {
        clearTimeout(timer);
        timer = setTimeout(update, 30);
    }

    controller.bind('change', _update);
    _update();

}
