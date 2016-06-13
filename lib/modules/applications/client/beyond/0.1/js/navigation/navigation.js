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

    var active;
    Object.defineProperty(this, 'active', {
        'get': function () {
            return active;
        }
    });

    var activeShowID = 0;

    function showPage(pathname, state) {

        if (active && active.pathname === pathname) {
            return;
        }

        if (active) {
            active.hide();
            active = undefined;
        }

        activeShowID++;
        var callbackID = activeShowID;

        pages.get(pathname, callbackID, function (response) {

            if (activeShowID !== callbackID) {
                // This is a callback function being called from a previous page show
                return;
            }

            // Response being a string means it is an error
            if (typeof response === 'string') {
                console.error(response);
                return;
            }

            var page = response.page;
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

            if (response.initialState) {
                state = response.initialState;
                history.replaceState(state, '', location.href);
            }

            active = page;
            page.show();

        });

    }

    var onpopstate = Delegate(this, function () {

        active.hide();
        showPage(this.pathname, history.state);

    });

    function updateHref(pathname, state) {

        if (mode === 'hash') {

            window.removeEventListener('popstate', onpopstate);
            location.hash = pathname.substr(1);
            window.addEventListener('popstate', onpopstate);

            history.replaceState(state, '', location.href);

        }
        else if (beyond.params.local) {
            history.pushState(state, '', root + pathname);
        }
        else {
            history.pushState(state, '', pathname);
        }

    }

    this.navigate = function (pathname, state, done) {

        updateHref(pathname, state);
        if (active && pathname === this.pathname) return;

    };

    beyond.done(Delegate(this, function () {

        var pathname = this.pathname;
        if (pathname === '/') {

        }
        window.addEventListener('popstate', onpopstate);

    }));

}
