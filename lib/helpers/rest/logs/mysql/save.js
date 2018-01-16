module.exports = function (db) {
    "use strict";

    return function (data, callback) {

        if (!data.url || !data.method) {
            console.error('invalid logging data', data);
            return;
        }

        let values = '';

        let params = [
            'clientIP', 'url', 'parameters',
            'method', 'requestError', 'parseError',
            'responseCode', 'responseStatus',
            'responseData', 'responseTime'];

        for (var param of params) {

            let value = data[param];

            switch (typeof value) {
                case 'undefined':
                    values += 'NULL';
                    break;
                case 'boolean':
                    values += (value) ? 1 : 0;
                    break;
                case 'number':
                    values += value;
                    break;
                default:
                    values += '\'' + value + '\'';
                    break;
            }

            values += ', ';

        }

        // remove last comma
        values = values.substr(0, values.length - 2);

        let sql = 'CALL insert_log(' + values + ');';

        db.getConnection()
            .then(function (conn) {
                "use strict";

                sql = conn.query(sql, function (error, result) {

                    conn.release();
                    let id;

                    if (error) {
                        console.error('Error registering REST log to database:', error.message);
                    }
                    else {
                        id = result[0][0].ID;
                    }

                    if (callback) callback(id);

                });

            })
            .catch(function (error) {
                "use strict";
                console.error('Error getting connection to logs database:', error.message);
                if (callback) callback();
            });

    };

};
