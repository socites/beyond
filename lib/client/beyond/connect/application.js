beyond.application.extend('socket', {'type': 'property'}, async function () {

    let host = beyond.hosts.application.ws;

    if (!host) return;
    return await beyond.socket(host, {'reconnect': false});

});
