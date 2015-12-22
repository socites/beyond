var Controls = function () {
    "use strict";

    this.screens = new Screens();
    this.errors = new ControlsCollection();

    this.control = function (pathname) {

        var control = this.screens.control(pathname);
        if (!control) return this.errors.items[pathname];

        return control;

    };

};
