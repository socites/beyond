module.exports = function (path, config) {
    "use strict";

    let disk, db;
    config = (config) ? config : {};

    if (config.store === 'disk') {
        disk = 1;
    }
    else if (config.store === 'db') {
        db = new (require('./mysql'))(config);
        db = (db.valid) ? db : undefined;
    }

    let async = require('async');
    this.save = async(function *(resolve, reject, params, messageID, log) {

        try {

            let id;

            if (disk) {
                let message = require('./messages.js')(messageID, params);
                let id = yield logs.save(message, log);
                resolve(id);
            }
            else if (db) {
                db.insert();
            }

        }
        catch (exc) {
            console.log(exc.stack);
            resolve();
        }

    });

};
