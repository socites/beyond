var Toolbar = function (events) {
    "use strict";

    var self = this;
    var $container = $('#toolbar');
    $container.data('api', this);

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

    this.show = function () {
        $container.show();
    };

    this.hide = function () {
        $container.hide();
    };

};
Toolbar.prototype = new LayoutList();
