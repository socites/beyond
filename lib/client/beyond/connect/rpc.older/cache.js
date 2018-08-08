function Cache() {

    // generate the hash
    let hash = function (request) {

        let serialized = request.serialized;
        serialized.application = beyond.params.name;
        serialized = JSON.stringify(serialized);

        let hash = serialized.split('').reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return Math.abs(a & a);
        }, 0);

        hash = `RPC:${hash}`;

        return hash;

    };

    this.read = function (request) {

        let key = hash(request);
        return localStorage.getItem(key);

    };

    this.save = function (request, data) {

        data = JSON.stringify({
            'request': request.action,
            'time': Date.now(),
            'value': data
        });

        let key = hash(request);
        localStorage.setItem(key, data);

    };

    this.invalidate = function (request) {

        let exists = typeof localStorage.getItem(request.hash) !== 'undefined';
        if (exists) localStorage.removeItem(request.hash);

        return exists;

    };

}
