function Applications() {
    "use strict";

    new module.model.Collection(this, {
        'server': {
            'module': module,
            'path': 'applications/list'
        },
        'factory': 'applications'
    });

}
