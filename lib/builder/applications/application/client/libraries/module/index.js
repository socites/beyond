module.exports = require('async')(function *(resolve, reject, module, language, path, events) {
    "use strict";

    yield module.initialise();

    yield require('./types.js')(module, language, path, events);
    yield require('./statics.js')(module, path, events);

    resolve();

});
