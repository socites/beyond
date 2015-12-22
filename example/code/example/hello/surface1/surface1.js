var Controller = function (control) {
    "use strict";

    if (control.orphan) control.screen = {'pathname': '/screen1', 'state': {'hi': 'hello world'}};

    var $container;
    var header = new layout.Header();

    var render = function () {

        if ($container) return;

        $container = $('<div class="surface1 control" />').html('surface1');
        $('#content-viewer').append($container);

        $container.click(function () {
            hide();
            close();
        });

    };

    var hide = function () {
        console.log('hiding surface1');
        $container.hide();
    };

    this.show = function (state, done) {

        render();

        console.log('showing surface1');
        $container.show();

        done();

    };

    this.hide = hide;

};

define(function () {
    "use strict";

    return {'Controller': Controller};
});
