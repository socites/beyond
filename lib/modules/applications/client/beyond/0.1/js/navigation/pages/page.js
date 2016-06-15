/* The Page object is a wrapper to the page object created
 from the Page class exposed by the module.
 The Page object creates the container of the page, and it is inserted in the DOM

 The module that exposes the Page class is loaded when the dependencies is loaded.
 The dependencies are specified in the specs object.
 The specs object is registered in the start.js script by beyond.

 Once the dependencies are loaded, then the Page class is instantiated, and the "prepare" method
 is called. The prepared method is asynchronous, and it is also optional.
 After the "prepare" method is executed (only if exists), then the render method is executed.
 The render method is synchronous, and also optional.
 Finally the show method is executed, only if the page was not hidden before.

 If an error occurs, it is exposed in the "error" attribute.
 */
function Page(pathname, module, specs, parameter) {
    "use strict";

    var events = new Events({'bind': this});

    // showTime indicates when the page has to be shown.
    // It allows to give the time to transition of the page being hidden
    // without interfering with the transition of the active page being shown.
    // showTime is set by the navigation object when calling the .show method.
    // When the .hide method is called, the showTime is set as undefined,
    // meaning that this page is not currently active.
    var showTime;

    // The params to be sent to the page control.
    var params;

    // Is it the page active?
    Object.defineProperty(this, 'active', {
        'get': function () {
            // If the showTime was set, then the page is considered as active
            return !!showTime;
        }
    });

    Object.defineProperty(this, 'pathname', {
        'get': function () {
            return pathname;
        }
    });

    // control is the instance of the Page class exposed by the module
    var control;

    // Create the container of the page
    var $container = $('<div style="display: none;" class="beyond-page"/>')
        .attr('pathname', pathname);

    $('body > .container').append($container);

    var error;
    Object.defineProperty(this, 'error', {
        'get': function () {
            return error;
        }
    });

    var ready;

    var showing;
    var show = Delegate(this, function () {

        if (!showTime || showing || !ready) return;

        showing = true;

        if (typeof control.render === 'function') {
            control.render.call(control, params);
        }

        // The container has to be shown 500ms after the .show method was called
        // to let the animation of the previous page to be hidden.
        // But as it is required some time to load the dependencies of this page, and also the prepare
        // method can take extra time, it should probably be started before the 500ms.
        var timer = showTime - Date.now();
        if (timer < 0) timer = 0;

        setTimeout(function () {

            // In case that the page was hidden before it had the time to be executed
            if (!showTime) return;

            $container.show();
            $container.addClass('show');
            showing = false;

            if (typeof control.show === 'function') {
                control.show.call(control, params);
            }

            events.trigger('rendered');

        }, timer);

    });

    var prepare = Delegate(this, function () {

        var timer = setTimeout(function () {
            console.warn('Page "' + pathname +
                '" is taking too much time to invoke the callback of the "prepare" function.');
        }, 5000);

        control.prepare.call(control, params, function () {

            clearTimeout(timer);
            ready = true;
            show();

        });

    });

    /* Load the dependencies of the Page class. The module that exposes the Page class is
     automatically included by BeyondJS in the list of dependencies.
     */
    var dependencies = new Dependencies(module, specs.dependencies);
    dependencies.done(function () {

        var Control = module.dependencies.Page;

        if (typeof Control !== 'function') {
            error = 'Invalid control. Module "' + module.ID + '" must expose a function.';
            console.error(error, Control);
            return;
        }

        control = new Control($container, parameter);

        // Once the dependencies are loaded, then execute the "prepare" method (optional)
        if (typeof control.prepare === 'function') {
            prepare();
        }
        else {
            ready = true;
            show();
        }

    });

    this.show = function (_params, _showTime) {

        params = _params;
        showTime = _showTime;
        if (!showTime) showTime = Date.now();

        show();

    };

    this.hide = function () {

        showTime = undefined;

        if (!ready) {
            // The show method was never called, so just return
            return;
        }

        if (typeof control.hide === 'function') {
            control.hide.call(control);
        }

        setTimeout(function () {

            // In case that the page was shown again before it had the time to be executed
            if (showTime) return;

            $container.removeClass('show');
            setTimeout(function () {

                // In case that the page was shown again before it had the time to be executed
                if (showTime) return;
                $container.hide();

            }, 300);

        }, 200);

    };

}
