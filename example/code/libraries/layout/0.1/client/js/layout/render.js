var render = function (layout, events) {
    "use strict";

    var html = module.render('layout', module.texts);
    $(document.body).append(html);

    var $viewport = $('#viewport');

    layout.Header = Header;

    var toolbar = new Toolbar(events);
    Object.defineProperty(layout, 'toolbar', {
        'get': function () {
            return toolbar;
        }
    });

    var sidebar = new Sidebar(events);
    Object.defineProperty(layout, 'sidebar', {
        'get': function () {
            return sidebar;
        }
    });

    Object.defineProperty(layout, 'menubar', {
        'get': function () {
            return sidebar.menubar;
        }
    });

    layout.messages = new LayoutMessages();
    layout.loading = new Loading($('#state .loading'));
    layout.Synch = Synch;
    layout.downloading = new Downloading($('#state .downloading'));

    // layout error object controller
    setErrorController(layout);

    var offline = new Offline($('#state .offline'));

    Object.defineProperty(layout, 'LayoutList', {
        'get': function () {
            return LayoutList;
        }
    });

    Object.defineProperty(layout, 'Loading', {
        'get': function () {
            return Loading;
        }
    });

    return $viewport;

};
