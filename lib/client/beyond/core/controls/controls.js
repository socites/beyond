function Controls() {

    let events = new Events({'bind': this});

    let ready;
    Object.defineProperty(this, 'ready', {'get': () => ready});

    let controls = [];
    Object.defineProperty(this, 'list', {'get': () => controls});

    this.register = function (register) {

        for (let name in register) {

            let specs = register[name];
            if (typeof specs === 'string') {
                specs = {'path': specs};
            }

            controls[name] = new Control(name, specs);

        }

    };

    function importControls(controlsToImport, callback) {

        let coordinate = new Coordinate(controlsToImport, function () {
            if (callback) callback();
        });

        for (let i in controlsToImport) {

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

    let callbacks = [];
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

        for (let i in callbacks) {
            callbacks[i]();
        }

        callbacks = [];

    });

}
