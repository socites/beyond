if (!beyond.ui) {
    beyond.ui = {};
}
beyond.ui.PullDown = function (id, dependencies, createFnc) {

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
        'setParentScroller': function (scroller) {
            this.control.parentScroller = scroller;
        },
        'setPulled': function (pulled) {
            this.control.pulled = pulled;
        },
        'attached': function () {
            this.control.active = this.active;
        },
        'properties': {
            'parentScroller': {
                'type': Object,
                'observer': 'setParentScroller'
            },
            'pulled': {
                'type': Boolean,
                'observer': 'setPulled'
            }
        }
    });

};
