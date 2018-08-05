module.exports = require('async')(function* (resolve, reject, library, modules, order) {
    'use strict';

    let list = {}, items = {}, keys = [];

    for (let module of modules.keys) {

        module = modules.items[module];
        yield module.initialise();

        if (module.start) list[module.ID] = module;

    }

    // Only include the modules that are specified in the ordered list
    for (let i in order) {

        if (!order.hasOwnProperty(i)) continue;
        let module = `libraries/${library.name}/${order[i]}`;
        if (list[module]) {

            items[module] = list[module];
            keys.push(module);

        }

    }

    // Complete the ordered list with all the modules not specified in the configuration
    for (let moduleID in list) {

        if (!list.hasOwnProperty(moduleID)) continue;
        if (!(items[moduleID])) {

            items[moduleID] = list[moduleID];
            keys.push(moduleID);

        }

    }

    resolve({'items': items, 'keys': keys});

});
