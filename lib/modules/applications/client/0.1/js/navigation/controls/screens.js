var Screens = function () {
    "use strict";

    ControlsCollection.call(this);

    this.surface = function (pathname) {

        var keys = this.keys;
        for (var i in keys) {

            var key = keys[i];
            var screen = this.items[key];

            if (screen.pathname === pathname) return screen;

            var surface = screen.surface(pathname);
            if (surface) return surface;

        }

    };

};
