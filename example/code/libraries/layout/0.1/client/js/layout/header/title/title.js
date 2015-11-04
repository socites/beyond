var Title = function ($container) {
    "use strict";

    var $text = $container.children('.text');
    this.go = new GoButton($container.children('.go'));

    this.show = function () {
        $container.show();
    };

    this.hide = function () {
        $container.hide();
    };

};
