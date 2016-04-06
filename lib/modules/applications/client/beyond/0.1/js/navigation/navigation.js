function Navigation(beyond, pages, events) {
    "use strict";

    // Set pathname as a property
    pathname(this, events);
    var root = this.root;

    var mode = 'pushState';
    if (location.protocol === 'file:') mode = 'hash';
    else if (location.pathname.substr(location.pathname.length - 11) === '/index.html') mode = 'hash';

    Object.defineProperty(this, 'mode', {
        'get': function () {
            return mode;
        }
    });

    var active, background;
    Object.defineProperty(this, 'active', {
        'get': function () {
            return active;
        }
    });
    Object.defineProperty(this, 'background', {
        'get': function () {
            return background;
        },
        'set': function (value) {
            // TODO: load background page
        }
    });

    function defaultRoute() {

        var defaultRoute = beyond.params.defaultRoute;
        var pathname = '/';

        if (typeof defaultRoute === 'object' &&
            typeof auth === 'object' &&
            typeof auth.session === 'object') {

            if (auth.session.valid && typeof defaultRoute.signedin)
                pathname = defaultRoute.signedin;

            if (!auth.session.valid && typeof defaultRoute.signedout)
                pathname = defaultRoute.signedin;

        }
        else if (typeof defaultRoute === 'string') {
            pathname = defaultRoute;
        }

        if (pathname.substr(0, 1) !== '') pathname = '/' + pathname;

        return pathname;

    }

    this.navigate = function (pathname, initialState, done) {

        if (!beyond.ready) {
            console.error('Wait beyond to be ready.');
            return;
        }

        events.trigger('navigationBegin', pathname);

        if (active && pathname === this.pathname) return;

        if (active) {
            if (active.ready) active.hide();
        }
        if (background) {
            if (background.ready) background.hide();
            background = undefined;
        }

        pages.get(pathname, function (page) {

            // Page being a string means it is an error
            if (typeof page === 'string') {
                console.error(page);
                return;
            }

            if (page.initialState) {
                initialState = page.initialState;
            }
            page = page.page;

            if (mode === 'hash') {

                window.removeEventListener('popstate', delegate);
                location.hash = pathname.substr(1);
                window.addEventListener('popstate', delegate);

            }
            else if (beyond.params.local) {
                history.pushState(initialState, '', root + pathname);
            }
            else {
                history.pushState(initialState, '', pathname);
            }

            if (!page) {

                if (typeof layout === 'object' &&
                    typeof layout.error === 'object' &&
                    typeof layout.error.show === 'function') {

                    layout.error.show('404');

                }
                else {
                    console.error('404 - page not found.');
                }
                return;

            }

            active = page;

            page.done(function () {

                if (page.error) return;
                if (page !== active) return;

                events.trigger('navigationEnd', pathname);

                var timer;

                function rendered() {

                    clearTimeout(timer);
                    events.trigger('renderCompleted', pathname);

                    if (done) done();

                }

                timer = setTimeout(function () {

                    console.warn('Page "' + pathname + '" is taking too much time to render.');

                }, 5000);

                page.show(initialState, rendered);

            });

        });

    };

    this.onPopState = function () {

        var pathname = this.pathname;

        if (pathname === '/') {

            pathname = defaultRoute();
            if (pathname === '/') {

                console.error('No default route specified. ' +
                    'Try completing the property defaultRoute of the application params.');

                return;

            }
            else {

                this.navigate(pathname);

            }

        }

        pages.get(pathname, function (page) {

            page = page.page;
            var state = history.state;

            active.hide();
            if (background && background.ready) background.hide();
            background = undefined;

            active = page;
            active.show(state);

        });

    };

    beyond.done(Delegate(this, function () {

        var pathname = this.pathname;
        if (pathname === '/') pathname = defaultRoute();

        this.navigate(pathname);
        window.addEventListener('popstate', Delegate(this, 'onPopState'));

    }));

}
