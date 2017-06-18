// compile application modules
require('colors');
module.exports = require('async')(function *(resolve, reject, application, path, language) {
    "use strict";

    let modules = application.modules;
    yield modules.process();

    console.log('\tbuiling application modules'.green);

    for (let key of modules.keys) {

        let module = modules.items[key];
        yield module.initialise();

        console.log('\t\tbuiling module '.green + (key).bold.green);

        yield require('./types.js')(module, language, path);
        yield require('./statics.js')(module, language, path);

    }

    resolve();

});
