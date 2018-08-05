module.exports = function (libraries, config, runtime) {
    'use strict';

    let items = {}, keys = [];
    Object.defineProperty(this, 'items', {'get': () => items});
    Object.defineProperty(this, 'keys', {'get': () => keys});
    Object.defineProperty(this, 'length', {'get': () => keys.length});

    let Application = require('./application');
    for (let name in config.items) {

        let application;

        application = config.items[name];
        application = new Application(name, libraries, application, runtime);
        if (!application.valid) continue;

        keys.push(name);
        items[name] = application;

    }

};
