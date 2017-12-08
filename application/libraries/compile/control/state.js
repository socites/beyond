function updateState(controller, state) {
    "use strict";

    var library = controller.library;

    state.name = library.name;
    state.dirname = library.dirname;
    state.compiling = library.compiling;

}
