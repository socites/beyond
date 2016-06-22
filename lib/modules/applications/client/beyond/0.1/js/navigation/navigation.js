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

    var showPage = Delegate(this, function (pathname, params, callback) {

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

            history.replaceState(response.params, '', location.href);

            if (callback) {

                var onRendered = function () {
                    callback();
                    page.unbind('rendered', onRendered);
                };
                page.bind('rendered', onRendered);

            }

            active = page;
            page.show(params, showTime);

        });

    });

    var defaultUrl = Delegate(this, function (callback) {

        var callID = navigationID;

        var timer;
        setTimeout(function () {
            if (callID !== navigationID) return;
            console.error('Routing event to get the default page is taking too much time to respond.');
        }, 5000);

        var event = {
            'event': 'routing',
            'cancellable': true,
            'async': true
        };

        events.trigger(event, '/', function (response) {

            clearTimeout(timer);
            if (callID !== navigationID) return;

            if (!response) {
                console.error('Page default is not defined.', response);
                return;
            }
            if (typeof response !== 'object' || typeof response.pathname !== 'string' || !response.pathname) {
                console.error('Page default is invalid.', response);
                return;
            }
            if (response.pathname === '/') {
                console.error('Default pathname cannot be "/". It would result in an infinity loop.', response);
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

            updateHref(response.pathname, response.params);
            updateNavigation();

        }));

    });

    /*
     updateNavigation takes the history.state to use as the parameters to be sent to the page.
     Remember to update the state before calling this function.
     */
    var updateNavigation = Delegate(this, function (callback) {

        if (navigating === this.pathname) return;

        navigationID++;
        navigating = this.pathname;

        showPage(this.pathname, history.state, callback);

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

            if (typeof params !== 'undefined') {
                console.warn('Parameters can not be sent to the default page.');
            }
            navigateDefaultUrl();

        }
        else {
            updateHref(pathname, params);
            updateNavigation();
        }

    };

    beyond.done(Delegate(this, function () {

        window.addEventListener('popstate', onpopstate);

        // Hide the splashscreen
        beyond.phonegap.done(function () {

            if (navigator.splashscreen) {
                setTimeout(function () {
                    navigator.splashscreen.hide();
                }, 1000);
            }

        });

        if (this.pathname === '/') {
            navigateDefaultUrl();
        }
        else {
            updateNavigation(function () {

                // Required by phantom
                $('body').append('<div />').attr('id', 'phantom-ready');

            });
        }

    }));

}
