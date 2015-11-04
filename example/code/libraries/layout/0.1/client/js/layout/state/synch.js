var Synch = function () {
    "use strict";

    var $container = $('<div class="synch" />');
    $('#state').append($container);

    var events = new Events();
    this.bind = function (event, listener) {
        return events.bind(event, listener);
    };
    this.unbind = function (event, listener) {
        return events.unbind(event, listener);
    };

    var onClick = function () {
        events.trigger('click');
    };

    this.show = function () {
        $container.addClass('show');
        $container.bind('click', onClick);
    };

    this.hide = function (component) {
        $container.removeClass('show');
        $container.unbind('click', onClick);
    };

    Object.defineProperty(this, 'synchronizing', {
        'get': function () {
            return $container.hasClass('synchronizing');
        },
        'set': function (value) {
            if (value) $container.addClass('synchronizing');
            else $container.removeClass('synchronizing');
        }
    });

};
