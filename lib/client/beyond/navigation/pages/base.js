function PageBase(props, $container, vdir, dependencies) {
    "use strict";

    var search, querystring;
    Object.defineProperty(props, 'search', {
        'get': function () {
            return search;
        },
        'set': function (value) {
            search = value;
            querystring = new QueryString(value);
        }
    });

    var state;
    Object.defineProperty(props, 'state', {
        'get': function () {
            return state;
        },
        'set': function (value) {
            state = value;
        }
    });

    Object.defineProperty(this, '$container', {
        'get': function () {
            return $container;
        }
    });
    Object.defineProperty(this, 'vdir', {
        'get': function () {
            return vdir;
        }
    });
    Object.defineProperty(this, 'dependencies', {
        'get': function () {
            return dependencies.modules;
        }
    });
    Object.defineProperty(this, 'querystring', {
        'get': function () {
            return querystring;
        }
    });
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state;
        }
    });

}
