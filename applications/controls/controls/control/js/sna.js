function SNA() {
    "use strict";

    var events = new Events({'bind': this});

    var state = {};
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state;
        }
    });

    var actions = {};
    Object.defineProperty(this, 'actions', {
        'get': function () {
            return actions;
        }
    });

}
