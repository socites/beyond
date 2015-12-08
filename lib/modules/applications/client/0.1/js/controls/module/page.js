function Page(specs) {
    "use strict";

    Module.call(this, 'page', specs);

    this.controls = new ControlsCollection(Control);

    this.control = function (specs) {

        var pathname, moduleID;
        if (specs.pathname) pathname = specs.pathname;
        else moduleID = specs.moduleID;

        var keys = this.controls.keys;
        for (var key in keys) {

            key = keys[key];
            var control = this.controls.items[key];

            if (pathname && control.pathname === pathname) return control;
            else if (moduleID && control.moduleID === moduleID) return control;

        }

    };

    this.show = function () {

        if (!controller) {
            console.error('controller not loaded');
            return;
        }

        controller.show();
        if (this.type === 'page') this.controls

    };

    this.hide = function () {

        if (!this.controller) {
            console.error('controller not loaded');
            return;
        }

        // hide all controls
        var keys = this.controls.keys;
        for (var key in keys) {

            key = keys[key];
            var control = this.controls.items[key];

            control.controller.hide();

        }

        this.controller.hide();

    };

    this.remove = function (pathname) {
        this.keys.splice(this.keys.indexOf(pathname), 1);
        delete this.items[pathname];
    };

};
