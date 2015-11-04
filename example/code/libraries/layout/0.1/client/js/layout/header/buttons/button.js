var HeaderButton = function ($container, params) {
    "use strict";

    var self = this;

    var $button = $('<div />')
        .addClass('button')
        .addClass(params.class)
        .html(params.title);

    $button.click(function () {
        if (typeof params.click === 'function') params.click(self);
    });

    Object.defineProperty(this, 'selected', {
        'get': function () {
            return $button.hasClass('selected');
        },
        'set': function (value) {
            if (value) {
                $button.addClass('selected');
            }
            else {
                $button.removeClass('selected');
            }
        }
    });

    $container.append($button);
    $button.data('api', this);

};
