var Submenus = function (sidebar, events) {
    "use strict";

    var $sidebar = $('#sidebar');
    var $submenus = $('#sidebar .submenus');
    var submenus = {};

    this.push = function (ID) {

        var $submenu = $('<div />').addClass('submenu ' + ID);
        var $back = $('<div />').addClass('back').html('&#xf0a8;');
        var $items = $('<ul />').addClass('items');
        $submenu.append($back, $items);

        var self = this;
        $back.click(function () {
            self.hide();
        });

        $submenus.append($submenu);
        var submenu = {};
        Menubar.call(submenu, sidebar, events, $submenu);

        submenus[ID] = submenu;
        this[ID] = submenu;

    };

    this.show = function (ID) {

        $submenus.find('.submenus .submenu').hide();
        $submenus.find('.submenu .' + ID).show();

        $sidebar.addClass('show-submenu');

    };

    this.hide = function () {
        $sidebar.removeClass('show-submenu');
    }

};
