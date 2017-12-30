module.exports = function (config) {
    "use strict";

    let log;
    config = (config) ? config : {};

    if (config.store === 'files') {
        log = new (require('./files'))(config);
    }
    else if (config.store === 'db') {
        log = new (require('./mysql'))(config);
    }

    this.save = function (params, callback) {

        try {

            if (log) {
                log.save(params, callback);
            }

        }
        catch (exc) {
            console.log(exc.stack);
            resolve();
        }

    };

};
