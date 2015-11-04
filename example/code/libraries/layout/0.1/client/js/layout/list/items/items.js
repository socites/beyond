var LayoutItems = function (events) {
    "use strict";

    var sort = function () {

        items.sort(function (a, b) {
            return a.priority - b.priority;
        });

        return items;

    };

    var items = [];
    Object.defineProperty(this, 'objects', {
        'get': function () {

            sort();
            return items;

        }
    });

    this.push = function (item) {

        if (!item.ID) {
            console.error('layout item must specify an ID', item);
            return;
        }

        item = new LayoutItem(events, item);
        if (typeof item.priority !== 'number') {
            item.priority = 0;
        }

        // remove previous item with same ID if exists
        for (var i in items) {

            if (items[i].ID === item.ID) {

                delete items[i];
                items.splice(i, 1);
                break;

            }

        }

        // add item to the list
        items.push(item);
        this[item.ID] = item;

        return item;

    };

    this.get = function (ID) {

        for (var i in items) {
            if (items[i].ID === ID) {

                return items[i];

            }
        }

    };

    this.remove = function (ID) {

        for (var i in items) {
            if (items[i].ID === ID) {

                delete items[i];
                items.splice(i, 1);
                delete this[ID];

                return;

            }
        }

    };

};
