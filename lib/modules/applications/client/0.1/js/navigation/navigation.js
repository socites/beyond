function Navigation(beyond, events) {
    "use strict";

    var pages = new Pages(events);

    // Set pathname as a property
    pathname(this, events);

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

    this.navigate = function (pathname, state, done) {

        if (!beyond.ready) {
            console.error('Wait beyond to be ready.');
            return;
        }

        if (pathname === this.pathname) return;

        if (active) {
            active.hide();
        }
        if (background) {
            background.hide();
            background = undefined;
        }

        var page = pages.get(pathname);
        var initialState = page.initialState;
        page = page.page;

        if (!page) {
            if (typeof layout === 'object' &&
                typeof layout.error === 'object' &&
                typeof layout.error.show === 'function') {

                layout.error.show('404');
                return;

            }
        }

        active = page;
        page.done(function () {
            if (active.pathname === pathname) active.show();
        });

    };

    beyond.bind('start', function () {

        update();
        window.addEventListener('popstate', update);

    });

}
