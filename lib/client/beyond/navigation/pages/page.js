/* The Page object is a wrapper to the page object created
 from the Page class exposed by the module.
 The Page object creates the container of the page, and it is inserted in the DOM

 The module that exposes the Page class is loaded when the dependencies is loaded.
 The dependencies are specified in the specs object.
 The specs object is registered in the start.js script by beyond.

 Once the dependencies are loaded, then the Page class is instantiated.
 Then the "preview" method is called (if exists). After calling the "preview" method, then the "prepare" method
 is called. The "prepare" method is asynchronous, and it is also optional.
 After the "prepare" method is executed (only if exists), then the render method is executed.
 Finally the show method is executed, only if the page was not hidden before.

 If an error occurs, it is exposed in the "error" attribute.
 */
function Page(module, pathname, vdir, specs) {

    let events = new Events({'bind': this});

    // The instance of the Page class exposed by the module
    let control;
    // To expose privately some properties of the page
    let props;

    // showTime indicates when the page has to be shown.
    // It allows to give the time of the transition of the page to be hidden
    // without interfering with the transition of the active page being shown.
    // showTime is set by the navigation object when calling the .show method.
    // When the .hide method is called, the showTime is set as undefined,
    // meaning that this page is not currently active.
    let showTime;

    // Is it the page active?
    let active;
    Object.defineProperty(this, 'active', {'get': () => !!active});

    Object.defineProperty(this, 'pathname', {'get': () => pathname});

    Object.defineProperty(this, 'vdir', {'get': () => vdir});

    let state;
    Object.defineProperty(this, 'state', {
        'get': () => state,
        'set': value => {
            state = value;
            props ? props.state = value : undefined;
        }
    });


    // The location.search of the page
    let search;
    Object.defineProperty(this, 'search', {
        'get': () => search,
        'set': value => {
            search = value;
            props ? props.search = value : undefined;
        }
    });

    // Create the container of the page
    let $container = $('<div style="display: none; opacity: 0;" class="beyond-page"/>')
        .attr('pathname', pathname);

    $('body > .app-container').append($container);

    let error;
    Object.defineProperty(this, 'error', {'get': () => error});

    let ready, rendered;

    let showing;
    let show = Delegate(this, function () {

        if (!showTime || !ready || showing || active) {
            return;
        }

        active = true;
        showing = true;
        $container.show();

        // The container has to be shown 500ms after the .show method was called
        // to let the animation of the previous page to be hidden.
        // But as it is required some time to load the dependencies of this page, and also the prepare
        // method can take extra time, it should probably be started before the 500ms.
        let timer = showTime - Date.now();
        if (timer < 0) timer = 0;

        setTimeout(function () {

            // In case that the page was hidden before it had the time to be executed
            if (!showTime) return;

            showing = false;

            // In case that the page has navigated another page.
            if (beyond.pathname === pathname) {
                $container.addClass('show');
                $container.css('opacity', '');
            }

        }, timer);

    });

    let prepare = Delegate(this, function (callback) {

        let timer = setTimeout(function () {
            console.warn('Page "' + pathname +
                '" is taking too much time to invoke the callback of the "prepare" function.');
        }, 5000);

        control.prepare.call(control, function () {

            clearTimeout(timer);
            callback();

        });

    });

    /* Load the dependencies of the Page class. The module that exposes the Page class is
     automatically included by BeyondJS in the list of dependencies.
     */
    let coordinate = new Coordinate('dependencies', 'react', function () {

        let Control = dependencies.modules.Page;

        if (typeof Control !== 'function') {
            error = 'Invalid control. Module "' + module.ID + '" must expose a function.';
            console.error(error, Control);
            return;
        }

        props = {};
        let base = new PageBase(props, ['$container', 'vdir', 'dependencies', 'state', 'template']);
        props.$container = $container;
        props.vdir = vdir;
        props.dependencies = dependencies.modules;
        props.state = state;
        props.search = search;

        let Template = dependencies.modules.Template;
        if (Template) {
            props.template = new Template($container);
        }

        Control.prototype = base;
        control = new Control($container, vdir, dependencies.modules);

        if (typeof control.preview === 'function') {
            control.preview.call(control);
            ready = true;
            show();
        }

        function renderAndShow() {

            if (typeof control.render === 'function') {
                control.render.call(control);
            }
            if (typeof control.show === 'function') {
                control.show.call(control);
            }

            ready = true;
            rendered = true;
            show();
            events.trigger('rendered');

        }

        // Once the dependencies are loaded, then execute the "prepare" method (optional)
        if (typeof control.prepare === 'function') {
            prepare(renderAndShow);
        }
        else {
            renderAndShow();
        }

    });
    let dependencies = new Dependencies(module, specs.dependencies);

    let initialised;
    Object.defineProperty(this, 'initialised', {'get': () => !!initialised});

    this.initialise = function () {

        if (initialised) {
            console.error('Page cannot be initialised twice', pathname);
            return;
        }
        initialised = true;

        dependencies.done(coordinate.dependencies);

        if (module.react.loading) {
            module.react.done(coordinate.react);
        }
        else {
            coordinate.done('react');
        }

    };

    this.show = function (_showTime) {

        if (destroying) {
            console.error('Page is being destroyed.');
            return;
        }

        showTime = _showTime;
        if (!showTime) {
            showTime = Date.now();
        }

        show();

        if (rendered) {
            if (typeof control.show === 'function') {
                control.show.call(control);
            }
        }

        Polymer.dom.flush();

    };

    this.hide = function (done) {

        showing = false;

        if (!showTime) {
            console.warn('Page is already hidden', pathname);
            if (done) done();
            return;
        }

        if (!active) {
            // The show method was never called, so just return
            if (done) done();
            return;
        }

        showTime = undefined;
        active = false;

        if (typeof control.hide === 'function') {
            control.hide.call(control);
        }

        setTimeout(function () {

            // In case that the page was shown again before it had the time to be executed
            if (showTime && !destroying) return;

            $container.removeClass('show');
            setTimeout(function () {

                // In case that the page was shown again before it had the time to be executed
                if (showTime && !destroying) return;
                $container.hide();

                if (done) done();

            }, 300);

        }, 200);

    };

    this.resume = function () {

        if (!active || destroying) {
            // The show method was never called, so just return
            return;
        }

        if (typeof control.resume === 'function') {
            control.resume.call(control);
        }

    };

    let destroying;
    this.destroy = function () {

        destroying = true;
        this.hide(function () {

            // Give time to the transition to end
            setTimeout(Delegate(this, function () {

                if (typeof control.destroy === 'function') {
                    control.destroy.call(control);
                }

                $container.remove();

            }), 500);

        });

    };

}
