var Page = function (control) {
    "use strict";

    if (control.orphan) control.screen = {'pathname': '/master1', 'state': {'hi': 'hello world'}};

    var $container;
    var header = new layout.Header();

    var render = function () {

        if ($container) return;

        $container = $('<div class="slave1 control" />').html('slave1');
        $('#content-viewer').append($container);

        $container.click(function () {
            hide();
            close();
        });

    };

    var hide = function () {
        console.log('hiding slave1');
        $container.hide();
    };

    this.show = function (state, done) {

        render();

        console.log('showing slave1');
        $container.show();

        done();

    };

    this.hide = hide;

};

define(function () {
    "use strict";

    return {'Controller': Page};
});
