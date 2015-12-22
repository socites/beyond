var Screen = function (specs) {
    "use strict";

    Control.call(this, 'screen', specs);

    this.surfaces = new ControlsCollection(Surface);

    this.surface = function (pathname) {

        var keys = this.surfaces.keys;
        for (var key in keys) {

            key = keys[key];
            var surface = this.surfaces.items[key];

            if (surface.pathname === pathname) return surface;

        }

    };

    this.hide = function () {

        // hide all surfaces
        var keys = this.surfaces.keys;
        for (var key in keys) {

            key = keys[key];
            var surface = this.surfaces.items[key];

            surface.controller.hide();

        }

        this.controller.hide();

    };

    this.remove = function (pathname) {
        this.keys.splice(this.keys.indexOf(pathname), 1);
        delete this.items[pathname];
    };

};
