var Controls = function () {
    "use strict";

    var events = new Events({'bind': this});

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var controls = [];
    Object.defineProperty(this, 'list', {
        'get': function () {
            return controls;
        }
    });

    this.register = function (register) {

        for (var name in register) {

            var specs = register[name];
            if (typeof specs === 'string') {
                specs = {'path': specs};
            }

            controls[name] = new Control(name, specs);

        }

    };

    function importControls(controlsToImport, callback) {

        var coordinate = new Coordinate(controlsToImport, function () {
            if (callback) callback();
        });

        for (var i in controlsToImport) {

            (function (control) {

                control = controls[control];
                if (!control) {
                    console.error('Control "' + controlsToImport[i] + '" is not registered.');
                    return;
                }

                control.load(coordinate[control.name]);

            })(controlsToImport[i]);

        }

    }

    this.import = function (controlsToImport, callback) {

        if (!ready) {
            this.done(Delegate(importControls, controlsToImport, callback));
            return;
        }

        importControls(controlsToImport, callback);

    };

    var callbacks = [];
    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

    // Polymer is ready when beyond is ready
    beyond.done(function () {

        ready = true;
        events.trigger('ready');

        for (var i in callbacks) {
            callbacks[i]();
        }

        callbacks = [];

    });

};

beyond.controls = new Controls();
