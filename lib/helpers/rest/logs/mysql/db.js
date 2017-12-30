module.exports = function (config) {
    "use strict";

    var mysql = require('mysql');
    var pool;

    this.getConnection = function () {

        return new Promise(function (resolve, reject) {

            pool = (pool) ? pool : mysql.createPool(config);

            pool.getConnection(function (error, connection) {

                if (error || !connection) {
                    reject(error);
                    return;
                }

                resolve(connection);

            });

        });

    };

};
