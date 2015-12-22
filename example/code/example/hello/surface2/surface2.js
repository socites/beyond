var Controller = function (control) {
    "use strict";

    if (control.orphan) control.screen = {'pathname': '/screen2', 'state': {'hi': 'hello world'}};

    var $container;

    var render = function () {

        if ($container) return;

        $container = $('<div class="surface2 control" />').html('surface2');
        $('#content-viewer').append($container);

    };

    var hide = function () {
        console.log('hiding surface2');
        $container.hide();
    };

    this.show = function (state, done) {

        render();

        $container.click(function () {
            hide();
            close();
        });

        console.log('showing surface2');
        $container.show();

        done();

    };

    this.hide = hide;

};

define(function () {
    "use strict";

    return {'Controller': Controller};
});
