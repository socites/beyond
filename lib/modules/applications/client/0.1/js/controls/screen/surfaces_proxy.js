function SurfacesProxy(events, controls) {
    "use strict";

    var surfaces = [];
    Object.defineProperty(this, 'controls', {
        'get': function () {
            return surfaces;
        }
    });

    this.hide = function (specs) {

        for (var i in surfaces) surfaces[i].hide();

    };

    this.push = function (control) {
        surfaces.push(control);
    };

}
