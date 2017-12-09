function updateState(controller, state) {
    "use strict";

    var library = controller.library;

    state.name = library.name;
    state.dirname = library.dirname;
    state.compiling = library.compiling;

    state.messages = library.compiler.messages;
    state.lastMessage = state.messages[state.messages.length - 1];

}
