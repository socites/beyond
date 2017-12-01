function SNA() {
    "use strict";

    var events = new Events({'bind': this});

    var state = {'title': ''};
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

    this.setTitle = function (value) {
        state.title = value;
        events.trigger('change');
    };

    this.refresh = function () {
        console.log('refresh method executed');
    };

}
