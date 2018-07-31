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

        // updateState can change properties values, avoid to trigger change event in this case
        properties.silence = true;
        updateState(controller.controller, state, properties);
        properties.updateState(state);

        // Any change in properties values must trigger change event from this point
        properties.silence = false;
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
