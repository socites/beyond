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

    this.register = function (module, specs) {

        var moduleID = module.ID;

        var route;
        if (typeof specs === 'string') {
            route = specs;
            specs[moduleID] = {'route': route};
        }
        else if (typeof specs === 'object') {
            route = specs.route;
            specs[moduleID] = specs;
        }

        routes[route] = moduleID;
        modules[moduleID] = module;

    };

    this.registerPathname = function (pathname, moduleID) {

        if (!pages[moduleID]) {
            console.error('Module "' + moduleID + '" is invalid or is not a registered page.');
            return;
        }

        pathnames[pathname] = moduleID;

    };

    var create = function (pathname, moduleID, initialState) {

        if (!specs[moduleID]) {
            return 'Module "' + moduleID + '" is not a registered page.';
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

        var moduleID;
        moduleID = routes[pathname];
        if (moduleID) return create(pathname, moduleID);

        moduleID = pathnames[pathname];
        if (moduleID) return create(pathname, moduleID);


        events.trigger({'event': 'routing', 'async': true}, pathname, function (response) {

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
