var update = function (navigation, events, controls) {
    "use strict";

    var error = function (pathname, code, message) {

        if (message) console.error('navigation error', pathname, code, message);
        events.trigger('error', code, message);

    };

    var getController = function (pathname, state, done) {

        var open = function (route, done) {

            require([route.moduleID], function (controller) {

                if (typeof controller !== 'object') {

                    error(pathname, '404', 'Controller not specified');
                    done();
                    return;

                }

                var type = route.type;
                if (type && ['screen', 'surface'].indexOf(type) === -1) {

                    error(pathname, '404', 'Invalid controller type');
                    done();
                    return;

                }

                if (!type) type = 'screen';

                var Controller = controller.Controller;
                if (!Controller) {

                    error(pathname, '404', 'Invalid screen');
                    done();
                    return;

                }

                done(route.moduleID, Controller, type);

            });

        };

        var route = beyond.routes.items[pathname];
        if (route) {
            open(route, done);
            return;
        }

        events.trigger({'event': 'routing', 'async': true}, pathname, state, function (route) {

            if (!route) {

                error(pathname, '404');
                done();
                return;

            }

            open(route, done);

        });

    };

    var show = function (control, state, done, close) {

        var previous = beyond.navigation.previous;
        var active = beyond.navigation.active;

        if (previous && previous.type === 'surface') previous = previous.screen;
        if (active && active.type === 'surface') active = active.screen;

        if (previous && previous.pathname !== active.pathname) {
            // hide previous screen
            previous.hide();
        }

        (function (active) {

            var timer = setTimeout(function () {
                console.warn('controller callback not called', active.moduleID);
            }, 5000);

            control.controller.show(state, function () {
                clearTimeout(timer);
                if (done) done(control);
            }, close);

        })(active);

    };

    var create = function (pathname, state, done) {

        getController(pathname, state, function (moduleID, Controller, type) {

            if (!moduleID) return;

            var control, controller;
            var specs = {'pathname': pathname, 'moduleID': moduleID};

            switch (type) {

                case 'screen':

                    control = new Screen(specs);
                    controller = new Controller(screen);
                    control.controller = controller;
                    break;

                case 'surface':

                    var active = beyond.navigation.active;
                    var screen;

                    if (active && active.type === 'screen') {
                        screen = active;
                    }
                    else if (active && active.type === 'surface') {
                        if (active.screen) screen = active.screen;
                    }

                    control = new Surface(specs, screen);
                    controller = new Controller(control);
                    control.controller = controller;
                    break;

            }

            if (typeof controller.show !== 'function') {

                error(pathname, '404', 'controller does not expose a show method');
                if (done) done();
                return;

            }

            switch (type) {

                case 'screen':

                    controls.screens.push(control);
                    show(control, state, done);
                    break;

                case 'surface':

                    if (control.orphan) {
                        error(pathname, '404', 'surface did not set its screen');
                        return;
                    }

                    // find out the screen control
                    screen = control.screen;
                    if (typeof screen === 'string') screen = {'pathname': screen};
                    if (!screen.pathname) {
                        console.error('surface set an invalid screen', screen);
                        error(pathname, '404');
                        return;
                    }
                    if (screen.pathname.substr(0, 1) !== '/') {
                        console.error('surface set a relative pathname on its screen', screen);
                        error(pathname, '404');
                        return;
                    }

                    if (!controls.screens.exists(screen.pathname)) {

                        // screen control does not exists, so open and show it too
                        getController(screen.pathname, screen.state, function (moduleID, Controller, type) {

                            if (!moduleID) return;
                            var specs = {'pathname': screen.pathname, 'moduleID': moduleID};
                            screen = new Screen(specs);

                            var controller = new Controller(screen);
                            if (typeof controller.show !== 'function') {

                                error(pathname, '404', 'controller of the screen does not expose a show method');
                                if (done) done();
                                return;

                            }
                            screen.controller = controller;
                            screen.surfaces.push(control);
                            control.screen = screen;

                            controls.screens.push(screen);

                            show(control, state);

                        });

                    }
                    else {

                        screen = controls.screens.items[screen.pathname];
                        control.screen = screen;
                        screen.surfaces.push(control);

                    }

                    var close = function () {

                        var active = beyond.navigation.active;
                        if (active.pathname !== control.pathname) return;

                        beyond.navigate(control.screen.pathname);

                    };

                    show(control, state, done, close);
                    break;

            }

            events.trigger('update');

            if (done) done();

        });

    };

    return function (pathname, state, done) {

        if (!navigation.ready) {
            console.error('wait for navigation to be ready');
            return;
        }

        var control = controls.control(pathname);

        if (control) control.controller.show(state, function () {
            if (done) done();
            events.trigger('navigate', control);
        });
        else create(pathname, state, function (control) {
            if (done) done();
            events.trigger('navigate', control);
        });

    };

};
