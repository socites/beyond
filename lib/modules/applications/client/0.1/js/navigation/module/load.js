var moduleLoad = function (pathname, state, callback) {
    "use strict";

    routeGet(pathname, state, function (route, state) {

        if (!route) {
            callback('Route not found');
            return;
        }


    });

};
