beyond.application.extend('socket', {'type': 'property'}, function () {

    let host = beyond.hosts.application.ws;

    Object.defineProperty(this, 'socket', {
        'get': async function () {
            if (!host) return;
            return await beyond.socket(host, {'reconnect': false});
        }
    });

});
