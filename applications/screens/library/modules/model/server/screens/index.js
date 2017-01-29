module.exports = function () {
    "use strict";

    let async = require('async');

    this.join = async(function *(resolve, reject, params, socket, context) {

        socket.join(params.screen);
        resolve();

    });

    this.count = async(function *(resolve, reject, params, socket, context) {
        resolve(context.screens.size);
    });

    this.get = async(function *(resolve, reject, params, socket, context) {

        let screen = params.screen;
        let screens = context.library.screens;
        resolve(screens[screen]);

    });

    this.update = async(function *(resolve, reject, params, socket, context) {

        let screen = params.screen;
        let screens = context.library.screens;

        screens.update(screen, params);

        let io = context.connection.io;
        io.in(params.screen).emit('update', params);
        resolve();

    });

};
