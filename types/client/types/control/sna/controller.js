function Controller(Controller, dependencies, properties, creator) {
    "use strict";

    var events = new Events({'bind': this});

    function change() {
        events.trigger('change');
    }

    var controller = new Controller(change, dependencies, properties, creator);
    Object.defineProperty(this, 'controller', {
        'get': function () {
            return controller;
        }
    });

    function update() {
        if (controller.update) controller.update();
        events.trigger('change');
    }

    properties.bind('change', update);
    update();

}
