function Modules() {
    "use strict";

    var pages = new Pages();
    Object.defineProperty(this, 'pages', {
        'get': function () {
            return pages;
        }
    });

    this.show = function (specs, state, callback) {

        var control;
        control = pages.control(specs);

        if (control) {
            control.show();
            return;
        }

        var moduleID;
        if (!specs.moduleID) {

            beyond.routes.get(specs.pathname, state, function (route, state) {

                if (!route) {
                    callback();
                    return;
                }

                control = new Control({'moduleID': route.moduleID, 'pathname': route.pathname});
                control.load(function (error) {
                    if (!error) control.show();
                });

            });

        }
        else {

            control = new Control({'moduleID': specs.moduleID, 'pathname': specs.pathname});
            control.load(function (error) {
                if (!error) control.show();
            })

        }

    };

}
