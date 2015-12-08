function Module(type, specs) {
    "use strict";

    var moduleID;

    Object.defineProperty(this, 'type', {
        'get': function () {
            return type;
        }
    });

    var pathname = specs.pathname;
    if (specs.pathname.substr(0, 1) !== '/') pathname = '/' + pathname;
    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return pathname;
        }
    });

    Object.defineProperty(this, 'moduleID', {
        'get': function () {
            return specs.moduleID;
        }
    });

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

    var loading, loaded;
    this.load = function (moduleID, callback) {

        if (loading || loaded) return;
        loading = true;

        if (!moduleID) {
            console.error('moduleID not set');
            return;
        }

        require([moduleID], function (o) {

            loading = false;
            loaded = true;

            if (typeof o !== 'object') {
                callback('Page controller not specified');
                return;
            }

            var type = o.type;
            if (type && ['page', 'control'].indexOf(type) === -1) {
                callback('Invalid controller type');
                return;
            }

            if (!type) type = 'page';

            var Controller = o.Controller;
            if (!Controller) {
                callback('Invalid controller on module: ' + moduleID);
                return;
            }

            controller = new Controller();
            callback();

        });

    };

}
