var Menubar = function (sidebar, events, $container) {
    "use strict";

    var $items = $container.find('.items');
    var list = new LayoutList($items, events);

    Object.defineProperty(this, 'items', {
        'get': function () {
            return list.items;
        }
    });

    this.update = function () {
        list.update();
    };

};
