module.exports = function (application, moduleID, config) {
    "use strict";

    let items = {};
    let keys = [];
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });
    Object.defineProperty(this, 'keys', {
        'get': function () {
            return keys;
        }
    });
    Object.defineProperty(this, 'length', {
        'get': function () {
            return keys.length;
        }
    });

    for (let module in config) {

        if (typeof config[module] !== 'string') {

            let message = 'Invalid custom static entry on module "'.yellow +
                (moduleID).yellow.bold + '", on application "'.yellow +
                (application.name).yellow.bold + '".'.yellow;

            console.log(message);
            continue;

        }

        items[module] = config[module];
        keys.push(module);

    }

};
