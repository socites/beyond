function Navigation(beyond, pages, events) {
    "use strict";

    // Set pathname as a property of the navigation object.
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

    function updateHref(pathname, state) {

        var url = pathname;
        if (mode === 'hash') url = '#' + pathname.substr(1);
        if (beyond.params.local) url = root + url;

        history.pushState(state, undefined, url);

    }

    // On any change in navigation, the variable navigationID increments.
    // Helps to process only the active navigation on asynchronous calls
    // of the pages.get method & the defaultUrl function.
    var navigationID = 0;

    function showPage(pathname, state) {

        if (active && active.pathname === this.pathname) {
            return;
        }

        if (active) {
            active.hide();
            active = undefined;
        }

        var callID = navigationID;

        pages.get(pathname, state, function (response) {

            if (navigationID !== callID) {
                // This is a callback function being called from a previous page show.
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

    var navigateDefaultUrl = Delegate(this, function () {

        var callID = navigationID;

        defaultUrl(Delegate(this, function (pathname) {

            // In case another updateDefaultUrl call was made and this one is older.
            if (callID !== navigationID) return;

            updateHref(pathname);
            setTimeout(function () {
                showPage(pathname, history.state);
            }, 0);

        }));

    });

    var updateNavigation = Delegate(this, function () {

        if (active && active.pathname === this.pathname) return;
        navigationID++;

        if (this.pathname === '/') {
            navigateDefaultUrl();
        }
        else {
            showPage(this.pathname, history.state);
        }

    });

    var onpopstate = Delegate(this, function () {
        updateNavigation();
    });

    this.navigate = function (pathname, state) {
        updateHref(pathname, state);
        updateNavigation();
    };

    beyond.done(Delegate(this, function () {

        updateNavigation();
        window.addEventListener('popstate', onpopstate);

    }));

}
