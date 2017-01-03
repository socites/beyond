function Page($container, parameter, dependencies) {
    "use strict";

    this.preview = function () {

        $container.attr('id', 'dynamic-page');
        $container.html(module.render('index', module.texts));

        var control = $container.find('beyond-example-control').get(0);
        control.parentScroller = null;

        console.log(control);
        window.asd = control;

    };

}
