function updateState(controller, state) {
    "use strict";

    var application = controller.application;

    state.name = application.name;
    state.dirname = application.dirname;

}
