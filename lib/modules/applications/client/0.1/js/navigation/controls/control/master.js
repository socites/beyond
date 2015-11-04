var Master = function (specs) {
    "use strict";

    Control.call(this, 'master', specs);

    this.slaves = new ControlsCollection(Slave);

    this.slave = function (pathname) {

        var keys = this.slaves.keys;
        for (var key in keys) {

            key = keys[key];
            var slave = this.slaves.items[key];

            if (slave.pathname === pathname) return slave;

        }

    };

    this.hide = function () {

        // hide all slaves
        var keys = this.slaves.keys;
        for (var key in keys) {

            key = keys[key];
            var slave = this.slaves.items[key];

            slave.controller.hide();

        }

        this.controller.hide();

    };

    this.remove = function (pathname) {
        this.keys.splice(this.keys.indexOf(pathname), 1);
        delete this.items[pathname];
    };

};
