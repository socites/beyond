function PageBase(props, list) {
    "use strict";

    var page = this;

    function expose(name) {
        Object.defineProperty(page, name, {
            'get': function () {
                return props[name];
            }
        });
    }

    for (var prop in list) {
        expose(list[prop]);
    }

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
    Object.defineProperty(this, 'querystring', {
        'get': function () {
            return querystring;
        }
    });

}
