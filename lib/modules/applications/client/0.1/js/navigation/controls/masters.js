var Masters = function () {
    "use strict";

    ControlsCollection.call(this);

    this.control = function (pathname) {

        var keys = this.keys;
        for (var i in keys) {

            var key = keys[i];
            var master = this.items[key];

            if (master.pathname === pathname) return master;

            var slave = master.slave(pathname);
            if (slave) return slave;

        }

    };

};
