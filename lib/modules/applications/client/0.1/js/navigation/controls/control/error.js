var ErrorControl = function (specs) {
    "use strict";

    Control.call(this, 'error', specs);

    Object.defineProperty(this, 'code', {
        'get': function () {
            return code;
        }
    });

};
