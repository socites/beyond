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

    var navigationCount = 0;

    var _showPage = Delegate(this, function (pathname, search, state, callback) {

        if (active && active.pathname === this.pathname) {
            return;
        }

        if (active) {
            active.hide();
            active = undefined;
        }

        var callID = navigationID;

        // showTime defines when the new active page must be shown to give the time to the previous
        // page transition to finish.
        var showTime = Date.now() + 500;

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
                console.error('Page undefined');
                return;
            }

            history.replaceState(response.state, '', location.href);

            if (callback) {

                var onRendered = function () {
                    callback();
                    page.unbind('rendered', onRendered);
                };
                page.bind('rendered', onRendered);

            }

            active = page;

            page.state = response.state;
            page.search = search;
            if (!page.initialised) {
                page.initialise();
            }
            page.show(showTime);

        });

    });

    var timerShow, timerNavigate;

    function showPage() {
        var args = Array.prototype.slice.call(arguments, 0);
        clearTimeout(timerShow);
        timerShow = setTimeout(function () {
            _showPage.apply(undefined, args);
        }, 0);
    }

    var defaultUrl = Delegate(this, function (callback) {

        var callID = navigationID;

        var timer = setTimeout(function () {
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

            updateHref(response.pathname, response.state);
            updateNavigation();

        }));

    });

    var navigateWebWarning = Delegate(this, function () {

        if (!!beyond.params.local || navigationCount !== 2) {
            return;
        }

        var config = beyond.params.webWarning;

        var configured = (typeof config !== 'boolean') ? !!config : config;
        configured = configured && !!beyond.pages.routes['/web_warning'];
        if (!configured) {
            return;
        }

        var excludes = (config) ? config.excludes : undefined;
        excludes = (excludes) ? excludes.split(',') : [];
        if (excludes.indexOf('/web_warning') === -1) {
            excludes.push('/web_warning');
        }
        var excluded = excludes.indexOf(navigating) !== -1;
        if (excluded) {
            return;
        }

        if (beyond.phonegap.isPhonegap) {
            return;
        }

        beyond.navigate('/web_warning?next=' + encodeURIComponent(this.pathname));
        return true;

    });

    /*
     updateNavigation takes the history.state to use as the parameters to be sent to the page.
     Remember to update the state before calling this function.
     */
    var updateNavigation = Delegate(this, function (callback) {

        if (navigating === this.pathname) return;
        backToHome = false;

        navigationID++;
        navigationCount++;
        if (navigateWebWarning()) {
            return;
        }

        navigating = this.pathname;

        var search;
        if (mode === 'hash') {
            var hash = location.hash;
            search = hash.substr(hash.indexOf('?'));
        }
        else {
            search = location.search;
        }

        beyond.analytics.trackView(this.pathname);

        showPage(this.pathname, search, history.state, callback);

    });

    var onpopstate = Delegate(this, function () {

        if (this.pathname === '/') {
            navigateDefaultUrl();
        }
        else {
            updateNavigation();
        }

    });

    function navigate(pathname, state) {

        if (pathname === '/') {

            if (typeof state !== 'undefined') {
                console.warn('Parameters can not be sent to the default page.');
            }
            navigateDefaultUrl();

        }
        else {
            updateHref(pathname, state);
            updateNavigation();
        }

    }


    this.navigate = function (pathname, state) {

        clearTimeout(timerNavigate);

        timerNavigate = setTimeout(function () {
            navigate(pathname, state)
        }, 0);

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

        if (location.hash) {

            var pathname = location.hash.substr(1);
            if (pathname.substr(0, 1) !== '/') {
                pathname = '/' + pathname;
            }

            beyond.navigate(pathname);
            return;

        }

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

    var backToHome;
    Object.defineProperty(this, 'backToHome', {
        'get': function () {
            return !!backToHome;
        },
        'set': function (value) {
            // normally this property is set before the navigate,
            // the navigate cleans the backToHome
            setTimeout(function () {
                backToHome = !!value;
            }, 0);
        }
    });
    Object.defineProperty(beyond, 'backToHome', {
        'get': function () {
            return beyond.navigation.backToHome;
        },
        'set': function (value) {
            beyond.navigation.backToHome = value;
        }
    });

    function back() {
        if (!backToHome && history.length) {
            history.back();
        }
        else {
            backToHome = false;
            beyond.navigate('/');
        }
    }

    this.back = back;
    beyond.back = back;

    document.addEventListener("resume", function () {
        if (active && typeof active.resume === 'function') {
            active.resume();
        }
    });

}
