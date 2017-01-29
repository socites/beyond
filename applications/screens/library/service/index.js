module.exports = function (runtime, config, context) {
    "use strict";

    let async = require('async');
    let screens = new (require('./screens'));

    this.initialise = async(function *(resolve, reject) {
        context.screens = screens;
        resolve();
    });

    this.rpc = function (ions) {

        ions.use(function (socket, next) {

            /* For use on web applications
             let origin = socket.handshake.headers.origin;
             */

            let query = socket.request._query;
            next();

        });

    };

    this.connection = function (socket, context) {

        // Once the client is connected.
        // The context is the connection context, not the library context.

    };

};
