function PageBase(props, list) {
    'use strict';

    let page = this;

    function expose(name) {
        Object.defineProperty(page, name, {
            'get': function () {
                return props[name];
            }
        });
    }

    for (let prop in list) {
        expose(list[prop]);
    }

    let search, querystring;
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
