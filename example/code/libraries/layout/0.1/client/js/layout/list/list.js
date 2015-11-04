var LayoutList = function ($container, events) {
    "use strict";

    var items = new LayoutItems(events);
    Object.defineProperty(this, 'items', {
        'get': function () {
            return items;
        }
    });

    Object.defineProperty(this, 'iterator', {
        'get': function () {
            return items.objects;
        }
    });

    var render = function () {

        // clean up items
        $container.html('');

        var objects = items.objects;
        for (var i in objects) {

            var item = objects[i];
            var $item = item.render();

            $container.append($item);
            item.update();

        }

    };

    var timer;
    var update = function () {

        clearTimeout(timer);
        timer = setTimeout(render, 200);

    };

    this.update = function () {
        update();
    };

    Object.defineProperty(this, 'selected', {
        'get': function () {

            // find and return the selected items
            var selected = [];

            var items = items.objects;
            for (var i in items) {

                if (items[i].selected) {
                    selected.push(items[i]);
                }

            }

            return selected;

        },
        'set': function (itemID) {

            // set only one item as selected
            var items = items.objects;
            for (var i in items) {

                var item = items[i];
                item.selected = (item.ID === itemID);

            }

            update();

        }
    });

};
