var Surface = function (specs, screen) {
    "use strict";

    Control.call(this, 'surface', specs);

    Object.defineProperty(this, 'screen', {
        'get': function () {
            return screen;
        },
        'set': function (value) {
            screen = value;
        }
    });

    Object.defineProperty(this, 'orphan', {
        'get': function () {
            return !screen;
        }
    });

};
