module.exports = require('async')(function *(resolve, reject, library, version, specs, paths, json, events) {

    events.emit('message', 'building version "' + version.version + '"');

    let v = version.version;

    if (!version.build) {
        events.emit('error', 'Build configuration not set for library "' + library.name + '/' + version.version + '"');
        resolve();
        return;
    }

    json.client.versions[v] = {
        'build': {'path': version.path, 'hosts': version.build.hosts}
    };
    if (library.connect) {
        json.client.versions[v].ws = version.hosts.ws;
    }

    json.server.versions[v] = {};

    // This is the configuration of the order of the start modules
    if (version.start) {
        json.client.versions[v].start = version.start;
    }

    yield version.modules.process();

    if (!version.modules.keys.length) {
        events.emit('message', 'no modules found');
        resolve();
        return;
    }

    // Initialise all modules
    for (let key of version.modules.keys) {

        let module = version.modules.items[key];
        yield module.initialise();

        events.emit('message', 'building module "' + key + '"');
        yield require('./module')(module, specs, paths, events);

    }

    resolve();

});
