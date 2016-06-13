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

    var defaultUrl = Delegate(this, function (callback) {

        var event = {
            'event': 'routing',
            'cancellable': true,
            'async': true
        };
        events.trigger(event, '/', function (response) {

            if (typeof response !== 'string' || !response) {

                console.error('Default pathname "/" is not defined.');
                return;

            }

            callback(response);

        });

    });

    var updateDefaultUrlID = 0;
    var updateDefaultUrl = Delegate(this, function () {

        updateDefaultUrlID++;
        var actualDefaultUrlID = updateDefaultUrlID;

        defaultUrl(Delegate(this, function (pathname) {

            // In case another updateDefaultUrl call was made and this one is older
            if (actualDefaultUrlID !== updateDefaultUrlID) return;

            // In case the user has changed the url by navigating the application
            if (this.pathname !== '/') return;

            updateHref(pathname);
            showPage(pathname, history.state);

        }));

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

    var onpopstate = Delegate(this, function () {

        active.hide();

        if (this.pathname === '/') {
            updateDefaultUrl();
        }
        else {
            showPage(this.pathname, history.state);
        }

    });

    this.navigate = function (pathname, state, done) {

        updateHref(pathname, state);
        if (active && pathname === this.pathname) return;

    };

    beyond.done(Delegate(this, function () {

        if (this.pathname === '/') {

            defaultUrl(Delegate(this, function (pathname) {
                updateHref(pathname);
                showPage(pathname);
            }));

        }
        else {
            showPage(this.pathname);
        }

        window.addEventListener('popstate', onpopstate);

    }));

}
