var Controls = function () {

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
            var path = register[name];
            controls[name] = new Control(name, path);
        }

    };

    function importControls(controlsToImport, callback) {

        var coordinate = new Coordinate(controlsToImport, callback);

        for (var i in controlsToImport) {

            var control = controls[controlsToImport[i]];
            if (!control) {
                console.error('Polymer control "' + controlsToImport[i] + '" is not registered.');
                return;
            }

            control.load(coordinate[control.name]);

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

beyond.polymer = new Controls();
