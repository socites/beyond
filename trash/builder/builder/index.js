module.exports = new (function () {
    "use strict";

    let async = require('async');

    let events = new (require('events'));
    this.on = function (event, listener) {
        events.on(event, listener);
    };
    this.off = function (event, listener) {
        events.off(event, listener);
    };

    this.build = async(function *(resolve, reject, path, modules, specs, runtime) {

        if (!specs) {
            events.emit('error', 'Build configuration not specified');
            resolve();
            return;
        }

        if (specs.libraries) {
            yield require('./libraries')(modules, specs.libraries, path, events);
        }

        if (specs.applications) {
            yield require('./applications')(modules, specs.applications, path, runtime, events);
        }

        events.emit('message', 'done');
        resolve();

    });

});
