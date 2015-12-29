function ScreenProxy(surface, events, controls) {
    "use strict";

    var control;
    Object.defineProperty(this, 'control', {
        'get': function () {
            return control;
        }
    });

    Object.defineProperty(this, 'state', {
        'get': function () {
            return control.state;
        }
    });

    Object.defineProperty(this, 'processed', {
        'get': function () {
            return control && control.processed;
        }
    });

    var callbacks = [];
    var screenDone = function () {

        for (var i in callbacks) callbacks[i]();
        callbacks = [];

    };

    this.done = function (callback) {

        if (!this.processed) {
            callbacks.push(callback);
            return;
        }

        callback();

    };

    this.set = function (specs, state) {

        control = controls.getOrCreate(specs, state);

        if (control.type !== 'screen') {
            console.error('Screen control was expected', this.ID);
            return;
        }

        var timer;
        var done = function () {

            clearTimeout(timer);

        };

        control.done(function () {

            control.surfaces.push(surface);
            screenDone();

            if (controls.activeControl !== surface) return;
            if (controls.activeScreen === control) return;

            controls.activeScreen = control;

            timer = setTimeout(function () {
                console.warn('Module did not called the callback function on the show method');
            }, 5000);

            control.controller.show(state, done);

        });

    };

    this.show = function () {

        if (!control) return;
        if (control.processed) control.show();

    };

}
