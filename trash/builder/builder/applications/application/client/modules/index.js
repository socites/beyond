// compile application modules
module.exports = require('async')(function *(resolve, reject, application, path, language, events) {
    "use strict";

    let modules = application.modules;
    yield modules.process();

    console.log('builing application modules');

    for (let key of modules.keys) {

        let module = modules.items[key];
        yield module.initialise();

        console.log('builing module ' + key);

        yield require('./types.js')(module, language, path, events);
        yield require('./statics.js')(module, language, path, events);

    }

    resolve();

});
