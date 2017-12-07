function Libraries(model) {
    "use strict";

    new model.Collection(this, {
        'server': {
            'module': module,
            'path': 'libraries/list'
        },
        'factory': 'library'
    });

}
