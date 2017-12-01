function Page($container, parameter, dependencies) {
    "use strict";

    this.preview = function (state) {

        $container.attr('id', 'error-page');

        var html = module.render('index', module.texts);
        $container.html(html);

    };

}
