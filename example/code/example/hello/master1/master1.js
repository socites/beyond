var Page = function () {
    "use strict";

    var $container;

    var render = function () {

        if ($container) return;

        var html = module.render('index', module.texts);
        $container = $('<div class="master1 control" />').html(html);
        $('#content-viewer').append($container);

    };

    this.show = function (state, done) {

        console.log('showing master1');
        render();
        $container.show();

        done();

    };

    this.hide = function () {
        console.log('hiding master1');
        $container.hide();
    };

};

define(function () {
    "use strict";

    return {'Controller': Page};
});
