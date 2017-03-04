require('colors');

module.exports = require('async')(function *(resolve, reject, module, specs, paths) {
    "use strict";

    if (specs.client) {
        yield require('./client')(module, specs, paths.js);
    }

    if (specs.server) {
        yield require('./server')(module, specs, paths.ws);
    }

    resolve();

});
