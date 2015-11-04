var Sidebar = function (events) {
    "use strict";

    var self = this;

    var $container = $('#sidebar');
    $container.data('api', self);

    this.menubar = new MainMenubar(this, events);
    this.submenus = new Submenus(this, events);

    var hide = function (event) {

        if (event) {
            var $this = $(event.target);
            if ($this.parents('li.menubar').length) return;
            if ($this.parents('#sidebar').length) return;
        }

        $container.removeClass('show');
        $container.removeClass('show-submenu');
        $(document).unbind('click', hide);

    };

    Object.defineProperty(this, 'displayed', {
        'get': function () {
            return $container.hasClass('show');
        }
    });

    this.show = function () {
        $container.addClass('show');
        $(document).bind('click', hide);
    };

    this.hide = hide;

    events.bind('item:click', function (item) {
        if (item.ID !== 'menubar' &&
            (typeof item.autohide === 'undefined' || item.autohide)) hide();
    });

};
