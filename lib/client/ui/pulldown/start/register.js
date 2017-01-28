beyond.ui = (beyond.ui) ? beyond.ui : {};
beyond.ui.PullDown = function (id, dependencies, createFnc, behaviors) {
    "use strict";

    // Check parameters
    if (typeof id !== 'string' ||
        typeof dependencies !== 'object' ||
        typeof createFnc !== 'function' ||
        (behaviors && !(behaviors instanceof Array))) {

        throw new Error('Invalid parameters');
    }

    behaviors = (behaviors) ? behaviors : [];

    Polymer({
        'is': id,
        'created': function () {
            this.control = new Control(this, dependencies, createFnc);
        },
        'ready': function () {
            this.control.setControlReady();
        },
        'setScroller': function (value) {
            this.control.scroller = value;
        },
        'setPulled': function (value) {
            this.control.pulled = value;
        },
        'behaviors': behaviors,
        'properties': {
            'overwriteScroller': {
                'type': Boolean
            },
            'scroller': {
                'type': Object,
                'observer': 'setScroller'
            },
            'pulled': {
                'type': Boolean,
                'observer': 'setPulled'
            }
        }
    });

};
