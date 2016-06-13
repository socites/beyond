function Page(pathname, module, specs, parameter) {
    "use strict";

    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return pathname;
        }
    });

    var activated;
    Object.defineProperty(this, 'active', {
        'get': function () {
            return !!activated;
        }
    });

    var control;
    var $container = $('<div style="display: none;" class="beyond-page"/>')
        .attr('pathname', pathname);

    $('body > .container').append($container);

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

    function done() {

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    }

    var prepare = Delegate(this, function (state, done) {

        var timer = setTimeout(function () {
            console.warn('Page "' + pathname +
                '" is taking too much time to invoke the callback of the "prepare" function.');
        }, 5000);

        control.prepare(state, function () {

            ready = true;
            clearTimeout(timer);
            control.show.call(control, state, function () {

                showing = false;
                done();

            });

        });

    });

    var show = Delegate(this, function () {

    });

    var dependencies = new Dependencies(module, specs.dependencies);
    dependencies.done(function () {

        var Control = module.dependencies.Page;

        if (typeof Control !== 'function') {
            error = 'Invalid control. Module "' + module.ID + '" must expose a function.';
            console.error(error, Control);
            return;
        }

        control = new Control($container, parameter);
        if (typeof control.prepare === 'function') {
            prepare();
        }
        else {
            ready = true;
            if (typeof control.render === 'function') {
                control.render();
                show();
            }

            done();
        }

    });

    var show = Delegate(this, function (state) {

        if (showing) return;

        showing = true;
        control.show.call(control, state);

        setTimeout(function () {

            // In case that the page was hidden before it had the time to be executed
            if (!activated) return;

            $container.show();
            $container.addClass('show');
            showing = false;

        }, 500);

    });

    var showing;
    this.show = function (state) {

        activated = Date.now();
        if (ready) show(state);

    };

    this.hide = function () {

        activated = undefined;

        if (!ready) {
            // The show method was never called, so just return
            return;
        }

        if (typeof control.hide === 'function') {
            control.hide.apply(control, arguments);
        }

        setTimeout(function () {

            // In case that the page was shown again before it had the time to be executed
            if (activated) return;

            $container.removeClass('show');
            setTimeout(function () {

                // In case that the page was shown again before it had the time to be executed
                if (activated) return;
                $container.hide();

            }, 300);

        }, 200);

    };

    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }
        callbacks.push(callback);

    };

}
