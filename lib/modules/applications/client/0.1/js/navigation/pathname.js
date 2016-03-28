var pathname = function (navigation) {
    "use strict";

    Object.defineProperty(navigation, 'pathname', {
        'get': function () {

            var pathname = location.pathname;
            if (beyond.params.local) {

                // extract the application name and language from the pathname
                pathname = pathname.split('/');
                pathname.splice(1, 2);
                pathname = pathname.join('/');

            }

            if (!pathname) pathname = '/';
            else if (pathname && pathname.substr(0, 1) !== '/') pathname = '/' + pathname;

            return pathname;

        }
    });

};
