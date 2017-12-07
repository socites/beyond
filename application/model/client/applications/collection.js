function Applications(model) {
    "use strict";

    new model.Collection(this, {
        'server': {
            'module': module,
            'path': 'applications/list'
        },
        'factory': 'applications'
    });

}
