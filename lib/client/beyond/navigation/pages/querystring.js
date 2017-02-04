function QueryString(search) {
    "use strict";

    if (search.substr(0, 1) === '?') {
        search = search.substr(1);
    }

    search = search.split('&')

    if (search == "") return {};

    for (var i = 0; i < search.length; ++i) {

        var param = search[i].split('=', 2);
        if (param.length != 2) {
            continue;
        }

        this[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));

    }

}
