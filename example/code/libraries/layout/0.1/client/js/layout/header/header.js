var Header = function () {
    "use strict";

    var $header = $('#header');
    var html = module.render('header', {
        'title': '',
        'more': module.texts.more,
        'go': module.texts.go
    });
    var $container = $('<div />').html(html).addClass('instance');
    $header.append($container);

    this.show = function () {
        $header.children('.instance').hide();
        $container.show();

        $header.show();
    };

    this.hide = function () {
        $container.hide();
    };

    var buttons = new HeaderButtons($container.find('.buttons'));
    Object.defineProperty(this, 'buttons', {
        'get': function () {
            return buttons;
        }
    });

    var actions = new HeaderActions($container.find('.actions'));
    Object.defineProperty(this, 'actions', {
        'get': function () {
            return actions;
        }
    });

    Object.defineProperty(this, 'title', {
        'get': function () {
            return $container.find('.title').html();
        },
        'set': function (value) {
            $container.find('.title').html(value);
        }
    });

    var plus = new PlusButton($container);
    Object.defineProperty(this, 'plus', {
        'get': function () {
            return plus;
        }
    });

    var community = new Title($container.children('.community'));
    Object.defineProperty(this, 'community', {
        'get': function () {
            return community;
        }
    });

};
