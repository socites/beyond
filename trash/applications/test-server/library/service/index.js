module.exports = function (runtime, config) {
    "use strict";

    this.rpc = function (ions) {

        ions.use(function (socket, next) {

            /* For use on web applications
             let origin = socket.handshake.headers.origin;
             */

            let query = socket.request._query;
            next();

        });

    };

    this.connection = function (context) {
    };

};
