function QueryString(search) {
    'use strict';

    search = (search.substr(0, 1) === '?') ? search.substr(1) : search;
    search = search.split('&');

    if (search === '') return {};

    for (let i = 0; i < search.length; ++i) {

        let param = search[i].split('=', 2);
        if (param.length !== 2) {
            continue;
        }

        this[param[0]] = decodeURIComponent(param[1].replace(/\+/g, ' '));

    }

}
