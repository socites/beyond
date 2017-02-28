module.exports = require('async')(function *(resolve, reject, module, language, pathJS) {
    "use strict";

    yield module.initialise();

    yield require('./types.js')(module, language, pathJS);
    yield require('./statics.js')(module, pathJS);

    resolve();

});
