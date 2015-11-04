var PlusButton = function ($container) {
    "use strict";

    var $plus = $container.find('.plus');

    var callback;
    this.click = function (_callback) {

        if (callback) $plus.unbind('click', callback);

        callback = _callback;
        $plus.bind('click', callback);

    };

    Object.defineProperty(this, 'selected', {
        'get': function () {
            return $plus.hasClass('selected');
        },
        'set': function (value) {
            if (value) $plus.addClass('selected');
            else $plus.removeClass('selected');
        }
    });

    this.show = function () {
        $plus.show();
    };

    this.hide = function () {
        $plus.hide();
    };
};
