function Page($container, parameter, dependencies) {
    "use strict";

    this.preview = function () {

        $container.attr('id', 'dynamic-page');
        $container.html(module.render('index', module.texts));

    };

}
