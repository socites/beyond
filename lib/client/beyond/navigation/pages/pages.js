/*
 Factory of pages.
 This object is being exposed in beyond.pages

 The modules of type "page" register the pages configuration,
 specifying the route of the page and its dependencies.

 Pathnames can dynamically be registered, ex: the url of an article

 The get method asynchronously returns a page object, that is a wrapper to the page object
 created from the Page class exposed by the module.
 */
function Pages(events) {
    "use strict";

    // Pages instances
    var pages = {};

    // Modules registered as pages
    var modules = {};

    // Pages configurations
    var specs = {};

    // Registered routes
    // The difference between the routes and the pathnames is that
    // routes are registered in the start.js script, through the specification of the module
    // and the pathnames are registered dynamically (ex, the url of an article)
    var routes = {};
    Object.defineProperty(this, 'routes', {
        'get': function () {
            return routes;
        }
    });

    // Registered pathnames who have a known associated moduleID
    var pathnames = {};
    Object.defineProperty(this, 'pathnames', {
        'get': function () {
            return pathnames;
        }
    });

    /* Modules of type "page" are registered in the start.js script.
     They pass the module object and the specification of the page,
     with the route and the dependencies of the module. */
    this.register = function (module, _specs) {

        var moduleID = module.ID;

        var route;
        if (typeof _specs === 'string') {

            route = _specs;
            if (route.substr(0, 1) !== '/') route = '/' + route;
            specs[moduleID] = {'route': route};

        }
        else if (typeof _specs === 'object') {

            if (_specs.route && _specs.route.substr(0, 1) !== '/') {
                _specs.route = '/' + _specs.route;
            }

            route = _specs.route;
            specs[moduleID] = _specs;

        }

        if (route) {
            routes[route] = moduleID;
        }
        modules[moduleID] = module;

    };

    // Pathnames can be registered dynamically. By instance, the url of an article.
    this.registerPathname = function (pathname, moduleID) {

        if (!modules[moduleID]) {
            console.error('Module "' + moduleID + '" is invalid or is not a registered page.');
            return;
        }

        pathnames[pathname] = moduleID;

    };

    var create = function (pathname, moduleID, state, vdir) {

        if (!specs[moduleID]) {
            return 'Module "' + moduleID + '" does not exist.';
        }

        var page = new Page(
            modules[moduleID],
            pathname,
            vdir,
            specs[moduleID]);

        pages[pathname] = page;

        return {
            'page': page,
            'state': state
        };

    };

    this.remove = function (pathname) {

        var page = pages[pathname];
        if (!page) return;

        page.destroy();
        delete pages[pathname];

    };

    // Asynchronously get a page
    this.get = function (pathname, state, callback) {

        // If the page is in memory, it is immediately returned.
        var page = pages[pathname];
        if (page) {
            callback({
                'page': page,
                'state': state
            });
            return;
        }

        // Look for the module in the list of registered routes.
        // routes are specified in the start.js script through the module configuration
        var moduleID = routes[pathname];
        if (!moduleID) {

            var path = pathname.split('/');
            var vdir = [];
            var dir;

            // The ending part of the pathname specifies the vdir of the page
            // ex: /signin/token, the pathname is /signin and the vdir is the token
            while (dir = path.pop()) {

                vdir.unshift(dir);
                moduleID = routes[path.join('/')];
                if (moduleID) {

                    callback(create(
                        pathname,
                        moduleID,
                        state,
                        vdir.join('/')
                    ));
                    return;

                }

            }

        }

        if (moduleID) {
            callback(create(pathname, moduleID, state));
            return;
        }

        // Look for the module in the list of registered pathnames
        // Pathnames are dynamically registered, ex: the url of an article
        moduleID = pathnames[pathname];
        if (moduleID) {
            callback(create(pathname, moduleID, state));
            return;
        }


        // If the module is not found, because there is no registered route,
        // or registered pathname, then let the hooks find the appropriate module
        var event = {
            'event': 'routing',
            'cancellable': true,
            'async': true
        };
        events.trigger(event, pathname, function (response) {

            if (!response || !response.moduleID) {

                callback('Pathname "' + pathname + '" does not have a module associated to it.');
                return;

            }

            var moduleID = response.moduleID;
            var state = response.state;

            callback(create(pathname, moduleID, state));

        });

    };

}
