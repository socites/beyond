function Socket(host, beyond) {

    let io, socket;

    if (beyond.params.local && host.substr(0, 1) === '/') {
        host = location.hostname + ':' + beyond.hosts.ports.ws + host;
    }

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    this.get = function () {

    };

    function initialise() {

    }

    require(['socket.io'], function (_io) {
        io = _io;
        initialise();
    });

}
