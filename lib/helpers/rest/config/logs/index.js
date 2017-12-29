module.exports = function (exports, config) {
    "use strict";

    if (config.source === 'db') {
        require('./db.js')(exports, config);
    }
    else if (config.source === 'files') {
        require('./files.js')(exports, config);
    }

};
