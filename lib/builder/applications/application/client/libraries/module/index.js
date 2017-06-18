module.exports = require('async')(function *(resolve, reject, module, language, path) {
    "use strict";

    yield module.initialise();

    yield require('./types.js')(module, language, path);
    yield require('./statics.js')(module, path);

    resolve();

});
