module.exports = require('async')(function *(resolve, reject, version, specs, path, json) {

    console.log('\tbuilding version "'.green + (version.version).bold.green + '"');

    let v = version.version;

    json.client.versions[v] = {
        'build': {'path': version.path, 'hosts': version.build.hosts}
    };
    json.server.versions[v] = {};

    // This is the configuration of the order of the start modules
    if (version.start) {
        json.client.versions[v].start = version.start;
    }

    yield version.modules.process();

    if (!version.modules.keys.length) {
        console.log('\tno modules found');
        resolve();
        return;
    }

    // Initialise all modules
    for (let key of version.modules.keys) {

        let module = version.modules.items[key];
        yield module.initialise();

        console.log('\t\tbuilding module '.green + (key).bold.green);
        yield require('./module')(module, specs, version.build);

    }

    resolve();

});
