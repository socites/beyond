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

                    error(pathname, '404', 'Page controller not specified');
                    done();
                    return;

                }

                var type = controller.type;
                if (type && ['master', 'slave'].indexOf(type) === -1) {

                    error(pathname, '404', 'Invalid controller type');
                    done();
                    return;

                }

                if (!type) type = 'master';

                var Controller = controller.Controller;
                if (!Controller) {

                    error(pathname, '404', 'Invalid page controller');
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

        if (previous && previous.type === 'slave') previous = previous.master;
        if (active && active.type === 'slave') active = active.master;

        if (previous && previous.pathname !== active.pathname) {
            // hide previous master
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

                case 'master':

                    control = new Master(specs);
                    controller = new Controller(master);
                    control.controller = controller;
                    break;

                case 'slave':

                    var active = beyond.navigation.active;
                    var master;

                    if (active && active.type === 'master') {
                        master = active;
                    }
                    else if (active && active.type === 'slave') {
                        if (active.master) master = active.master;
                    }

                    control = new Slave(specs, master);
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

                case 'master':

                    controls.masters.push(control);
                    show(control, state, done);
                    break;

                case 'slave':

                    if (control.orphan) {
                        error(pathname, '404', 'slave control did not set its master');
                        return;
                    }

                    // find out the master control
                    master = control.master;
                    if (typeof master === 'string') master = {'pathname': master};
                    if (!master.pathname) {
                        console.error('slave control set an invalid master', master);
                        error(pathname, '404');
                        return;
                    }
                    if (master.pathname.substr(0, 1) !== '/') {
                        console.error('slave control set a relative pathname on its master', master);
                        error(pathname, '404');
                        return;
                    }

                    if (!controls.masters.exists(master.pathname)) {

                        // master control does not exists, so open and show it too
                        getController(master.pathname, master.state, function (moduleID, Controller, type) {

                            if (!moduleID) return;
                            var specs = {'pathname': master.pathname, 'moduleID': moduleID};
                            master = new Master(specs);

                            var controller = new Controller(master);
                            if (typeof controller.show !== 'function') {

                                error(pathname, '404', 'controller of the master does not expose a show method');
                                if (done) done();
                                return;

                            }
                            master.controller = controller;
                            master.slaves.push(control);
                            control.master = master;

                            controls.masters.push(master);

                            show(control, state);

                        });

                    }
                    else {

                        master = controls.masters.items[master.pathname];
                        control.master = master;
                        master.slaves.push(control);

                    }

                    var close = function () {

                        var active = beyond.navigation.active;
                        if (active.pathname !== control.pathname) return;

                        beyond.navigate(control.master.pathname);

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
