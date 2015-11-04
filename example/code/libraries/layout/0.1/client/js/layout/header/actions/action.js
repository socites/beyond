var HeaderAction = function ($container, params) {
    "use strict";

    var $icon = $('<div />').addClass('icon');
    var $text = $('<div />').addClass('text');

    var $action = $('<div />')
        .addClass('action')
        .append($icon).append($text);

    $action.click(function () {
        if ($action.hasClass('disabled')) return;
        if (typeof params.click === 'function') params.click(self);
    });

    $container.append($action);

    var icon;
    Object.defineProperty(this, 'icon', {
        'get': function () {
            return $icon.html();
        },
        'set': function (value) {

            if (!value) {
                $icon.hide();
                if (!text) $action.hide();
            }
            else {
                $icon.show();
                if (display) $action.show();
            }

            $icon.html(value);

        }
    });

    var text;
    Object.defineProperty(this, 'text', {
        'get': function () {
            return $text.text();
        },
        'set': function (value) {

            if (!value) {
                $text.hide();
                if (!icon) $action.hide();
            }
            else {
                $text.show();
                if (display) $action.show();
            }

            $text.text(value);

        }
    });

    Object.defineProperty(this, 'enabled', {
        'get': function () {
            return !($action.hasClass('disabled'));
        },
        'set': function (value) {
            if (value) $action.removeClass('disabled');
            else $action.addClass('disabled');
        }
    });

    this.text = params.text;
    this.icon = params.icon;

    var display = true;
    this.show = function () {
        display = true;
        $action.show();
    };

    this.hide = function () {
        display = false;
        $action.hide();
    };

};
