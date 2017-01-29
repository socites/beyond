module.exports = function () {
    "use strict";

    let async = require('async');

    let socketId;

    this.join = async(function *(resolve, reject, params, socket, context) {

        if (typeof params.screenId !== 'string') {
            throw new Error('Invalid parameter screenId');
        }

        console.log('join', params.screenId);
        socket.join(params.screenId);
        resolve();

    });

    this.count = async(function *(resolve, reject, params, socket, context) {
        resolve(context.screens.size);
    });

    this.get = async(function *(resolve, reject, params, socket, context) {

        if (typeof params.screenId !== 'string') {
            throw new Error('Invalid parameter screenId');
        }

        let screens = context.library.screens;
        resolve(screens[params.screenId]);

    });

    this.update = async(function *(resolve, reject, params, socket, context) {

        if (typeof params.screenId !== 'string') {
            throw new Error('Invalid parameter screenId');
        }

        let screens = context.library.screens;
        screens.update(params.screenId, params);

        let ns = context.connection.ns;
        console.log('update sent to', params.screenId);
        ns.to(params.screenId).emit('update', params);

        resolve();

    });

};
