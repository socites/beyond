var Page = function () {
    "use strict";

    var $container;

    var render = function () {

        if ($container) return;

        $container = $('<div class="screen2 control" />').html('screen2');
        $('#content-viewer').append($container);

    };

    this.show = function (state, done) {

        console.log('showing screen2');
        render();
        $container.show();

        done();

    };

    this.hide = function () {
        console.log('hiding screen2');
        $container.hide();
    };

};

define(function () {
    "use strict";

    return {'Controller': Page};
});
