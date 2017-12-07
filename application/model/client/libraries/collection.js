function Libraries() {
    "use strict";

    new module.model.Collection(this, {
        'server': {
            'module': module,
            'path': 'libraries/list'
        },
        'factory': 'library'
    });

}
