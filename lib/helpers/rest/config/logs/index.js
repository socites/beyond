module.exports = function (exports, config) {
    "use strict";

    if (config.store === 'db') {
        require('./db.js')(exports, config);
    }
    else if (config.store === 'files') {
        require('./files.js')(exports, config);
    }

};
