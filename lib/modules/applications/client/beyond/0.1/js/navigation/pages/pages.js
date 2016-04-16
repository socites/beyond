function Pages(events) {
    "use strict";

    // Pages instances
    var pages = {};

    // Pages modules
    var modules = {};

    // Pages configurations
    var specs = {};

    // Registered routes
    var routes = {};

    // Registered pathnames who have a known associated moduleID
    var pathnames = {};

    this.register = function (module, config) {

        var moduleID = module.ID;

        var route;
        if (typeof config === 'string') {

            route = config;
            if (route.substr(0, 1) !== '/') route = '/' + route;
            specs[moduleID] = {'route': route};

        }
        else if (typeof config === 'object') {

            if (config.route.substr(0, 1) !== '/') config.route = '/' + route;
            route = config.route;
            specs[moduleID] = config;

        }

        routes[route] = moduleID;
        modules[moduleID] = module;

    };

    this.registerPathname = function (pathname, moduleID) {

        if (!modules[moduleID]) {
            console.error('Module "' + moduleID + '" is invalid or is not a registered page.');
            return;
        }

        pathnames[pathname] = moduleID;

    };

    var create = function (pathname, moduleID, initialState) {

        if (!specs[moduleID]) {
            return 'Module "' + moduleID + '" does not have a valid configuration.';
        }

        var page = new Page(pathname, modules[moduleID], specs[moduleID]);
        pages[pathname] = page;

        return {
            'page': page,
            'initialState': initialState
        };

    };

    this.get = function (pathname, callback) {

        var page = pages[pathname];
        if (page) {
            callback({'page': page});
            return;
        }

        var moduleID = routes[pathname];
        if (!moduleID) {
            var path = pathname.split('/');
            while (path.pop()) {
                moduleID = routes[path.join('/')];
                if (moduleID) break;
            }
        }

        if (moduleID) {
            callback(create(pathname, moduleID));
            return;
        }

        moduleID = pathnames[pathname];
        if (moduleID) {
            callback(create(pathname, moduleID));
            return;
        }


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
            var initialState = response.initialState;

            callback(create(pathname, moduleID, initialState));

        });

    };

}
