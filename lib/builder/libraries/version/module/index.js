require('colors');

module.exports = require('async')(function *(resolve, reject, module, languages, specs, paths) {
    "use strict";

    yield require('./client.js')(module, languages, specs, paths.js);
    resolve();

});
