/**
 * The toolbar icon that allows to display the sidebar
 */
var update = function () {
    "use strict";

    var toolbar = $('#toolbar').data('api');

    var item = toolbar.items.push({
        'ID': 'menubar',
        'priority': 0,
        'text': '&#xf0c9;'
    });

    item.click = function () {

        if (sidebar.displayed) sidebar.hide();
        else sidebar.show();

    };

    toolbar.update();

};

if (layout.ready) update();
else layout.bind('ready', update);
