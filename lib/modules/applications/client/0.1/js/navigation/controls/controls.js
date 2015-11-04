var Controls = function () {
    "use strict";

    this.masters = new Masters();
    this.errors = new ControlsCollection();

    this.control = function (pathname) {

        var control = this.masters.control(pathname);
        if (!control) return this.errors.items[pathname];

        return control;

    };

};
