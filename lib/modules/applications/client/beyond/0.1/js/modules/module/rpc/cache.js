var Cache = function () {
    "use strict";

    // generate the hash
    var hash = function (request) {

        var serialized = request.serialized;
        serialized.application = beyond.params.name;
        serialized = JSON.stringify(serialized);

        var hash = serialized.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return Math.abs(a & a);
        }, 0);

        hash = 'RPC:' + hash;

        return hash;

    };

    this.read = function (request) {

        var key = hash(request);
        return localStorage.getItem(key);

    };

    this.save = function (request, data) {

        data = JSON.stringify({
            'request': request.action,
            'time': Date.now(),
            'value': data
        });

        var key = hash(request);
        localStorage.setItem(key, data);

    };

    this.invalidate = function (request) {

        var exists = typeof localStorage.getItem(request.hash) !== 'undefined';
        if (exists) localStorage.removeItem(request.hash);

        return exists;

    };

};
