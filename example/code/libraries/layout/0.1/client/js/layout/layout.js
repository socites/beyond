var Layout = function () {
    "use strict";

    var events = new Events({'bind': this});

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var $viewport;

    this.initialise = function () {

        $viewport = render(this, events);
        var refresh = resize($viewport);

        if (document.readyState !== "complete") {

            // this happen when the layout is loaded as a script
            // in the head section of the html, this is common in tests pages

            $(window).load(function () {
                $('#viewport').addClass('show');
                $(window).bind('resize', refresh);
                refresh();
            });

        }
        else {
            // this happen when the layout is loaded by the index.html loader
            // in this case the "show" class is appended to the $('#viewport') by the loader
            $(window).bind('resize', refresh);
            refresh();
        }

        ready = true;
        events.trigger('ready');

    };

};

(function (layout) {

    window.layout = layout;

    layout.initialise();

    window.toolbar = layout.toolbar;
    window.menubar = layout.menubar;
    window.sidebar = layout.sidebar;

})(new Layout());
