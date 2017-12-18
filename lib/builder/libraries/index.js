module.exports = require('async')(function *(resolve, reject, modules, specs, path, events) {
    "use strict";

    if (typeof specs !== 'object') {
        events.emit('error', 'Invalid libraries build configuration');
        resolve();
        return;
    }

    let libraries = modules.libraries;

    for (let name in specs) {

        events.emit('message', 'compiling library "' + name + '"');

        let library = libraries.items[name];
        if (!library) {
            events.emit('error', 'Library "' + name + '" is not registered');
            continue;
        }
        if (!library.build) {
            events.emit('error', 'Build not set for library "' + library.name + '"');
            resolve();
            return;
        }

        yield require('./library.js')(library, specs[name], path, events);

    }

    resolve();

});
