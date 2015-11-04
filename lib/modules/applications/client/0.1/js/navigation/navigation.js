var Navigation = function (beyond) {
    "use strict";

    var events = new Events({'bind': this});

    // set pathname as a property
    pathname(this, events);

    var controls = new Controls();
    this.controls = controls;

    // previous pathname
    var previous;
    Object.defineProperty(this, 'previous', {
        'get': function () {
            if (!previous) return;
            return controls.control(previous);
        }
    });

    Object.defineProperty(this, 'active', {
        'get': function () {
            return controls.control(this.pathname);
        }
    });

    update = update(this, events, controls);
    this.update = update;

    this.navigate = function (pathname, state, done) {

        if (previous === pathname) return;

        // @initial is set to undefined because
        // if user navigates and goes back, then @initial would be set and
        // the first popstate event will be triggered, and it will be discarded
        initial = undefined;

        if (pathname.substr(0, 1) !== '/') {
            console.error('navigate function does not support relative paths');
            return;
        }

        // call the pushState to update the navigation
        var url = pathname;
        var params = beyond.params;
        if (beyond.params.local)
            url = '/' + params.name + '/' + params.language + pathname;

        if (state && state.JSON) state = state.JSON;
        history.pushState(state, '', url);

        update(beyond.navigation.pathname, state, function () {
            previous = pathname;
            if (done) done();
        });

    };

    // some browsers trigger the onpopstate event when navigation starts, some not
    var initial = location.href;
    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    beyond.bind('start', function () {

        ready = true;
        events.trigger('ready');

        update(beyond.navigation.pathname);

        window.addEventListener('popstate', function () {

            // avoid to call the show method twice at the beginning of navigation
            // on some browsers the popstate event is triggered at start, others not
            if (initial && initial === location.href) return;
            initial = undefined;

            update(beyond.navigation.pathname);

        });

    });

};
