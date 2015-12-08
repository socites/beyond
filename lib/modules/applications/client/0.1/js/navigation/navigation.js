var Navigation = function (beyond, controls) {
    "use strict";

    var events = new Events({'bind': this});

    // set pathname as a property
    pathname(this, events);

    // previous pathname
    var previous;

    Object.defineProperty(this, 'active', {
        'get': function () {
            return controls.control(this.pathname);
        }
    });

    var updater = new Updater(this, events, controls);
    this.navigate = function (pathname, state, done) {

        if (previous === pathname) return;
        previous = pathname;

        events.trigger('change');

        // @initial is set to undefined because
        // if user navigates and goes back, then @initial would be set and
        // the first popstate event will be triggered, and it will be discarded
        initial = undefined;

        if (pathname.substr(0, 1) !== '/') pathname = '/' + pathname;

        // call the pushState to update the navigation
        var url = pathname;
        var params = beyond.params;
        if (beyond.params.local)
            url = '/' + params.name + '/' + params.language + pathname;

        if (state && state.JSON) state = state.JSON;
        history.pushState(state, '', url);

        updater.update(state, function () {
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

        updater.update();

        window.addEventListener('popstate', function (event) {

            // avoid to call the show method twice at the beginning of navigation
            // on some browsers the popstate event is triggered at start, others not
            if (initial && initial === location.href) return;
            initial = undefined;

            updater.update(event.state);

        });

    });

};
