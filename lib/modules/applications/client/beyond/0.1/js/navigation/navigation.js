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

    var active, navigating;
    Object.defineProperty(this, 'active', {
        'get': function () {
            return active;
        }
    });

    function updateHref(pathname, state) {

        var url = pathname;
        if (mode === 'hash') url = '#' + pathname.substr(1);
        if (beyond.params.local) url = root + url;

        history.pushState(state, '', url);

    }

    // On any change in navigation, the variable navigationID increments.
    // Helps to process only the active navigation on asynchronous calls
    // of the pages.get method & the defaultUrl function.
    var navigationID = 0;

    function showPage(pathname, params) {

        if (active && active.pathname === this.pathname) return;

        if (active) {
            active.hide();
            active = undefined;
        }

        var callID = navigationID;

        // showTime defines when the new active page must be shown to give the time to the previous
        // page transition to finish.
        var showTime = Date.now() + 500;

        pages.get(pathname, params, function (response) {

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

            if (response.params) {
                params = response.params;
                history.replaceState(params, '', location.href);
            }

            active = page;
            page.show(showTime);

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

        if (navigating === '/') return;

        navigationID++;
        navigating = '/';

        var callID = navigationID;

        defaultUrl(Delegate(this, function (response) {

            // In case another updateDefaultUrl call was made and this one is older.
            if (callID !== navigationID) return;

            if (typeof response !== 'object' || typeof response.pathname !== 'string' || !response.pathname) {
                console.error('Page default is not defined.');
                return;
            }
            if (response.pathname === '/') {
                console.error('Default pathname cannot be "/". It would result in an infinity loop.');
                return;
            }

            updateHref(response.pathname, response.params);
            updateNavigation();

        }));

    });

    var updateNavigation = Delegate(this, function () {

        if (navigating === this.pathname) return;

        navigationID++;
        navigating = this.pathname;

        showPage(this.pathname, history.state);

    });

    var onpopstate = Delegate(this, function () {

        if (this.pathname === '/') {
            navigateDefaultUrl();
        }
        else {
            updateNavigation();
        }

    });

    this.navigate = function (pathname, params) {

        if (pathname === '/') {
            navigateDefaultUrl();
        }
        else {
            updateHref(pathname, params);
            updateNavigation();
        }

    };

    beyond.done(Delegate(this, function () {

        window.addEventListener('popstate', onpopstate);

        if (this.pathname === '/') {
            navigateDefaultUrl();
        }
        else {
            updateNavigation();
        }

    }));

}
