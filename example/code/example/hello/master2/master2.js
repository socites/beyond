var Page = function () {
    "use strict";

    var $container;

    var render = function () {

        if ($container) return;

        $container = $('<div class="master2 control" />').html('master2');
        $('#content-viewer').append($container);

    };

    this.show = function (state, done) {

        console.log('showing master2');
        render();
        $container.show();

        done();

    };

    this.hide = function () {
        console.log('hiding master2');
        $container.hide();
    };

};

define(function () {
    "use strict";

    return {'Controller': Page};
});
