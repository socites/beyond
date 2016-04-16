function Page(pathname, module, specs) {
    "use strict";

    var events = new Events({'bind': this});

    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return pathname;
        }
    });

    var control;

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var callbacks = [];

    var error;
    Object.defineProperty(this, 'error', {
        'get': function () {
            return error;
        }
    });

    var dependencies = new Dependencies(module, specs.dependencies);
    dependencies.done(function () {

        var Control = module.dependencies.Page;

        if (typeof Control !== 'function') {
            error = 'Invalid control. Module "' + module.ID + '" must expose a function.';
            console.error(error, Control);
        }
        else {
            control = new Control(events);
        }

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    });

    this.show = function (state, done) {

        if (!ready) {
            console.error('Module "' + '" is not ready to be shown.');
            return;
        }

        if (typeof control.prepare === 'function') {

            var timer = setTimeout(function () {

                console.warn('Page "' + pathname +
                    '" is taking too much time to invoke the callback of the "prepare" function.');

            }, 5000);

            control.prepare(state, function () {
                clearTimeout(timer);
                control.show.call(control, state, done);
            });

        }
        else {
            control.show.call(control, state, done);
        }

    };

    this.hide = function () {

        if (!ready) {
            console.error('Module "' + '" is not ready to be hidden.');
            return;
        }

        // hide method is optional
        if (typeof control.hide === 'function') control.hide.apply(control, arguments);

    };

    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }
        callbacks.push(callback);

    };

}
