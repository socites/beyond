module.exports = new (function (config) {
    "use strict";

    var mysql = require('mysql');
    var pool = mysql.createPool(config);

    this.getConnection = function () {

        return new Promise(function (resolve, reject) {

            pool.getConnection(function (error, connection) {

                if (error || !connection) {
                    reject(error);
                    return;
                }

                resolve(connection);

            });

        });

    };

});
