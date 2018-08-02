let Plugins = function (module) {
    'use strict';

    let plugins = {};

    let order;
    Object.defineProperty(this, 'order', {
        'get': () => order,
        'set': (value) => order = value
    });

    this.register = function (ID, plugin, group) {

        if (!group) group = 'default';
        if (!plugins[group]) plugins[group] = {};

        plugins[group][ID] = plugin;

    };

    this.get = function (group) {

        group = (!group) ? plugins.default : plugins[group];

        let ordered = [];
        for (let name of order) {
            if (group[name]) ordered.push(group[name]);
        }

        // set all the plugins not in the ordered list
        for (let name in group) {

            if (!group.hasOwnProperty(name)) continue;

            if (!order || order.indexOf(name) === -1) {
                ordered.push(group[name]);
            }

        }

        return ordered;

    };

};
