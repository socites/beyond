module.exports = require('async')(function *(resolve, reject, application, specs, runtime) {
    "use strict";

    // Process the modules to be ready when required for client and server processors
    let modules = application.modules;
    yield modules.process();

    let languages = specs.languages;
    if (typeof languages === 'string') {
        languages = [languages];
    }
    if (!(languages instanceof Array) || !languages.length) {
        languages = ['eng', 'spa'];
    }

    yield require('./client')(application, languages, specs.client, runtime);
    yield require('./server')(application, specs.server);

    resolve();

});
