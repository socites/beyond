var Plugins = function (module) {
    "use strict";

    var plugins = {};

    var order;
    Object.defineProperty(this, 'order', {
        'get': function () {
            return order;
        },
        'set': function (value) {
            order = value;
        }
    });

    this.register = function (ID, plugin, group) {

        if (!group) group = 'default';
        if (!plugins[group]) plugins[group] = {};

        plugins[group][ID] = plugin;

    };

    this.get = function (group) {

        if (!group) group = 'default';
        var group = plugins[group];

        var ordered = [];
        for (var i in order) {

            var name = order[i];
            if (group[name]) ordered.push(group[name]);

        }

        // set all the plugins not in the ordered list
        for (var name in group) {

            if (!order || order.indexOf(name) === -1) ordered.push(group[name]);

        }

        return ordered;

    };

};
