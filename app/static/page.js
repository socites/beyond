function Page($container, parameter, dependencies) {
    "use strict";

    this.prepare = function (state, done) {

        $container.attr('id', 'static-page');

        var html = module.render('index', module.texts);
        $container.html(html);

        $container.find('paper-button.navigate-dynamic').click(function () {
            beyond.navigate('/dynamic');
        });
        done();

    };

}
