beyond.ui.Control = function (id, dependencies, createFnc) {

    if (typeof id !== 'string' ||
        typeof dependencies !== 'object' ||
        typeof createFnc !== 'function') {

        throw new Error('Invalid parameters');
    }

    Polymer({
        'is': id,
        'created': function () {
            this.control = new Control(dependencies, createFnc);
        },
        'ready': function () {
            this.control.host = this;
        },
        'setActive': function (value) {
            this.control.active = value;
        },
        'attached': function () {
            this.control.active = this.active;
        },
        'properties': {
            'active': {
                'type': Boolean,
                'observer': 'setActive'
            }
        }
    });

};
