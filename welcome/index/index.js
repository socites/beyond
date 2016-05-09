function Page() {
    "use strict";

    var $container;

    function render() {

        $container = $('<div id="index-page"></div>');

        var html = module.render('index');
        $container.html(html);

        $('body').append($container);

    }

    this.show = function (state, done) {

        if (!$container) render();

        $container.show();
        if (done) done();

    };

}
