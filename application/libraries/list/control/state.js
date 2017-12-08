function updateState(controller, state) {
    "use strict";

    function processLibrary(library) {

        var output = {
            'id': library.id,
            'name': 'loading'
        };

        if (!library.loaded) {
            return output;
        }

        output.name = library.name;
        output.dirname = library.dirname;

        return output;

    }

    var output = [];

    var libraries = controller.libraries.entries;
    for (var index in libraries) {
        output.push(processLibrary(libraries[index]));
    }

    state.libraries = output;

}
