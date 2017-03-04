require('colors');

module.exports = require('async')(function *(resolve, reject, module, specs, paths) {
    "use strict";

    yield require('./client')(module, specs, paths.js);
    yield require('./server')(module, specs, paths.ws);
    resolve();

});
