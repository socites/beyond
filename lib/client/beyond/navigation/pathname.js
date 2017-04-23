var pathname = function (navigation) {
    "use strict";

    var root = '';
    if (navigation.mode === 'hash') {
        root = location.pathname;
    }
    else if (beyond.params.local) {

        var pathname = location.pathname.split('/');
        root = [''];

        if (pathname[1] === 'applications') root = root.concat(pathname.splice(1, 2));
        if (pathname[1] === 'languages') root = root.concat(pathname.splice(1, 2));

        root = root.join('/');

    }

    Object.defineProperty(navigation, 'root', {
        'get': function () {
            return root;
        }
    });

    Object.defineProperty(navigation, 'pathname', {
        'get': function () {

            if (navigation.mode === 'hash') {

                var hash = location.hash;
                if (hash.substr(0, 1) === '#') {
                    hash = hash.substr(1);

                    var index = hash.indexOf('?');
                    if (index !== -1) {
                        hash = hash.substr(0, index);
                    }
                }
                return '/' + hash;

            }

            var pathname = location.pathname.substr(root.length);

            if (!pathname) pathname = '/';
            else if (pathname && pathname.substr(0, 1) !== '/') pathname = '/' + pathname;

            return pathname;

        }
    });

};
