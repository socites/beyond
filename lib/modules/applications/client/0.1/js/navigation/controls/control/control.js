var Control = function (type, specs) {
    "use strict";

    var expose = function (property, value) {

        Object.defineProperty(this, property, {
            'get': function () {
                return value;
            }
        });

    };

    expose.call(this, 'type', type);

    expose.call(this, 'pathname', specs.pathname);
    expose.call(this, 'moduleID', specs.moduleID);

    var controller;
    Object.defineProperty(this, 'controller', {
        'get': function () {
            return controller;
        },
        'set': function (value) {
            if (controller) {
                console.error('controller can be set only once');
                return;
            }
            controller = value;
        }
    });

};
