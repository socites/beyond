var HeaderButtons = function ($container) {
    "use strict";

    this.push = function (params) {

        var button = new HeaderButton($container, params);
        return button;

    };

    Object.defineProperty(this, 'selected', {
        'set': function (value) {

            $container.children('.button').each(function () {

                var button = $(this).data('api');
                if (button === value) {
                    button.selected = true;
                }
                else {
                    button.selected = false;
                }

            });
        }
    });

    this.clear = function () {
        $container.html('');
    };

};
