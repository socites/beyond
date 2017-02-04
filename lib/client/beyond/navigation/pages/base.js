function PageBase(page, $container, vdir, dependencies) {
    "use strict";

    Object.defineProperty(page, '$container', {
        'get': function () {
            return $container;
        }
    });

    Object.defineProperty(page, 'vdir', {
        'get': function () {
            return vdir;
        }
    });

    Object.defineProperty(page, 'dependencies', {
        'get': function () {
            return dependencies.modules;
        }
    });

    var search, querystring;
    Object.defineProperty(this, 'search', {
        'get': function () {
            return search;
        },
        'set': function (value) {
            search = value;
            querystring = new QueryString(value);
        }
    });
    Object.defineProperty(page, 'querystring', {
        'get': function () {
            return querystring;
        }
    });

    var state;
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state;
        },
        'set': function (value) {
            state = value;
        }
    });
    Object.defineProperty(page, 'state', {
        'get': function () {
            return state;
        }
    });

}
