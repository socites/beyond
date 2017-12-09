module.exports = require('async')(function *(resolve, reject, modules, specs, path, runtime, events) {
    "use strict";

    if (typeof specs !== 'object') {
        events.emit('error', 'Invalid applications build configuration');
        resolve();
        return;
    }

    let applications = modules.applications;

    for (let name in specs) {

        events.emit('message', 'building application "' + name + '"');

        let application = applications.items[name];
        if (!application) {
            events.emit('message', '\tApplication "' + name + '" is not registered');
            continue;
        }

        let success = yield require('./application')(application, specs[name], runtime, events);
        if (!success) {
            continue;
        }

    }

    resolve();

});
