function PageBase(props, list) {
    'use strict';

    let expose = (name) => Object.defineProperty(this, name, {'get': () => props[name]});
    for (let prop in list) expose(list[prop]);

    let search, querystring;
    Object.defineProperty(props, 'search', {
        'get': () => search,
        'set': function (value) {
            search = value;
            querystring = new QueryString(value);
        }
    });
    Object.defineProperty(this, 'querystring', {'get': () => querystring});

}
