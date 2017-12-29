module.exports = function (config) {
    "use strict";

    // db manages the connection pool
    let db = new (require('./db.js'))(config);

    this.insert = require('./insert.js')(db);

};
