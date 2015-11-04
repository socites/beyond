var Slave = function (specs, master) {
    "use strict";

    Control.call(this, 'slave', specs);

    Object.defineProperty(this, 'master', {
        'get': function () {
            return master;
        },
        'set': function (value) {
            master = value;
        }
    });

    Object.defineProperty(this, 'orphan', {
        'get': function () {
            return !master;
        }
    });

};
