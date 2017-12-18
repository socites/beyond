// compile imported libraries
module.exports = require('async')(function *(resolve, reject, application, path, language, events) {
    "use strict";

    events.emit('message', 'builing libraries');

    for (let name of application.libraries.keys) {

        events.emit('message', 'builing library ' + name);
        let library = application.libraries.items[name];

        yield library.modules.process();

        if (!library.modules.keys.length) {
            events.emit('message', 'no modules found');
            continue;
        }

        for (let key of library.modules.keys) {

            let module = library.modules.items[key];
            events.emit('message', 'builing module ' + key);

            yield require('./module')(module, language, path, events);

        }

    }

    resolve();

});
